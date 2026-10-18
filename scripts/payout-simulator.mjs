import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

/**
 * Public Midtrans withdrawal prices visible on the pricing page when checked
 * 18 Oct 2026. The GoPay value differs between language sections, so these are
 * separate reference scenarios—not a confirmed OSIDAC fee schedule.
 */
export const MIDTRANS_PUBLIC_PRICE_SCENARIOS = Object.freeze({
  bankAccount: Object.freeze({ channel: 'bank_account', payoutFeeIdr: 5_000, source: 'Midtrans public withdrawal pricing' }),
  goPayIdText: Object.freeze({ channel: 'gopay', payoutFeeIdr: 1_000, source: 'Midtrans Indonesian payouts/disbursement text' }),
  goPayWithdrawalTable: Object.freeze({ channel: 'gopay', payoutFeeIdr: 2_500, source: 'Midtrans English withdrawal table' }),
});

function assertWholeIdr(value, name, { allowZero = true } = {}) {
  if (!Number.isSafeInteger(value) || value < 0 || (!allowZero && value === 0)) {
    throw new TypeError(`${name} must be a ${allowZero ? 'non-negative' : 'positive'} whole IDR amount`);
  }
}

function assertRate(value, name, { allowZero = true } = {}) {
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0) || value > 1) {
    throw new TypeError(`${name} must be a rate between ${allowZero ? '0' : 'greater than 0'} and 1`);
  }
}

/**
 * Models the published fixed fee for a successful Midtrans payout, before any
 * tax. The public price page does not settle OSIDAC's tax treatment, contract
 * rate, or failed-attempt fees, so no all-in total is inferred here.
 */
export function estimateMidtransPayoutFeeBeforeTax({ amountIdr, payoutFeeIdr }) {
  assertWholeIdr(amountIdr, 'amountIdr', { allowZero: false });
  assertWholeIdr(payoutFeeIdr, 'payoutFeeIdr');

  return {
    amountIdr,
    payoutFeeBeforeTaxIdr: payoutFeeIdr,
    payoutFeeRateBeforeTax: payoutFeeIdr / amountIdr,
    recipientReceivesIdr: amountIdr,
    totalDebitBeforeTaxIdr: amountIdr + payoutFeeIdr,
    taxTreatment: 'unconfirmed',
    failedAttemptFees: 'unconfirmed',
  };
}

/**
 * Builds a conservative distribution ceiling. Revenue must already be net of
 * actual reversals/refunds, collection fees, tax provisions, and direct
 * fulfillment costs; cash must be the actual available payout-source balance.
 * Provider payout fees count inside the distribution ceiling.
 */
export function calculateDistributionBudget({
  settledNetEligibleRevenueIdr,
  cashAvailableIdr,
  cashReserveIdr = 0,
  distributionShareCap = 0.70,
  networkShareCap = 0.40,
}) {
  assertWholeIdr(settledNetEligibleRevenueIdr, 'settledNetEligibleRevenueIdr');
  assertWholeIdr(cashAvailableIdr, 'cashAvailableIdr');
  assertWholeIdr(cashReserveIdr, 'cashReserveIdr');
  assertRate(distributionShareCap, 'distributionShareCap');
  assertRate(networkShareCap, 'networkShareCap');

  const revenueLimitedBudgetIdr = Math.floor(settledNetEligibleRevenueIdr * distributionShareCap);
  const cashAfterReserveIdr = Math.max(0, cashAvailableIdr - cashReserveIdr);
  const distributionBudgetIdr = Math.min(revenueLimitedBudgetIdr, cashAfterReserveIdr);

  return {
    settledNetEligibleRevenueIdr,
    revenueLimitedBudgetIdr,
    cashAvailableIdr,
    cashReserveIdr,
    cashAfterReserveIdr,
    distributionBudgetIdr,
    networkCommissionCapIdr: Math.floor(distributionBudgetIdr * networkShareCap),
  };
}

/** Evaluates a successful payout against a planning budget before tax only. */
export function evaluatePayoutPreTaxRequest({ amountIdr, payoutFeeIdr, remainingDistributionBudgetIdr }) {
  assertWholeIdr(remainingDistributionBudgetIdr, 'remainingDistributionBudgetIdr');
  const estimate = estimateMidtransPayoutFeeBeforeTax({ amountIdr, payoutFeeIdr });

  return {
    ...estimate,
    remainingDistributionBudgetIdr,
    withinPreTaxBudget: estimate.totalDebitBeforeTaxIdr <= remainingDistributionBudgetIdr,
  };
}

/** Finds the smallest integer-IDR payout meeting a fee ceiling before tax. */
export function minimumPayoutForPreTaxCostRate({
  payoutFeeIdr,
  maximumCostRate = 0.03,
  maxAmountIdr = 1_000_000_000,
}) {
  assertWholeIdr(payoutFeeIdr, 'payoutFeeIdr');
  assertRate(maximumCostRate, 'maximumCostRate', { allowZero: false });
  assertWholeIdr(maxAmountIdr, 'maxAmountIdr', { allowZero: false });

  if (payoutFeeIdr === 0) return 1;
  if (payoutFeeIdr / maxAmountIdr > maximumCostRate) {
    throw new RangeError('maximumCostRate is below the fixed provider fee ratio for this amount range');
  }
  return Math.ceil(payoutFeeIdr / maximumCostRate);
}

function runCli() {
  const amountIdr = Number(process.argv[2] ?? 250_000);
  const bank = MIDTRANS_PUBLIC_PRICE_SCENARIOS.bankAccount;
  const goPayId = MIDTRANS_PUBLIC_PRICE_SCENARIOS.goPayIdText;
  const goPayEnglish = MIDTRANS_PUBLIC_PRICE_SCENARIOS.goPayWithdrawalTable;

  console.log(JSON.stringify({
    note: 'Public-price reference scenarios only. Fees are pre-tax; confirm channel eligibility, tax treatment, contracted fees, and retry costs with Midtrans.',
    amountIdr,
    scenarios: {
      bankAccount: { source: bank.source, ...estimateMidtransPayoutFeeBeforeTax({ amountIdr, payoutFeeIdr: bank.payoutFeeIdr }) },
      goPayIndonesianText: { source: goPayId.source, ...estimateMidtransPayoutFeeBeforeTax({ amountIdr, payoutFeeIdr: goPayId.payoutFeeIdr }) },
      goPayWithdrawalTable: { source: goPayEnglish.source, ...estimateMidtransPayoutFeeBeforeTax({ amountIdr, payoutFeeIdr: goPayEnglish.payoutFeeIdr }) },
    },
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCli();
}
