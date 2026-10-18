import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateDistributionBudget,
  evaluatePayoutPreTaxRequest,
  estimateMidtransPayoutFeeBeforeTax,
  minimumPayoutForPreTaxCostRate,
  MIDTRANS_PUBLIC_PRICE_SCENARIOS,
} from './payout-simulator.mjs';

test('Midtrans public pricing references expose the published bank fee and both GoPay listings', () => {
  assert.equal(MIDTRANS_PUBLIC_PRICE_SCENARIOS.bankAccount.payoutFeeIdr, 5_000);
  assert.equal(MIDTRANS_PUBLIC_PRICE_SCENARIOS.goPayIdText.payoutFeeIdr, 1_000);
  assert.equal(MIDTRANS_PUBLIC_PRICE_SCENARIOS.goPayWithdrawalTable.payoutFeeIdr, 2_500);
});

test('successful payout scenarios calculate fixed fees before tax without inferring all-in cost', () => {
  const bank = estimateMidtransPayoutFeeBeforeTax({ amountIdr: 250_000, payoutFeeIdr: 5_000 });
  const goPay = estimateMidtransPayoutFeeBeforeTax({ amountIdr: 250_000, payoutFeeIdr: 2_500 });

  assert.equal(bank.payoutFeeRateBeforeTax, 0.02);
  assert.equal(bank.totalDebitBeforeTaxIdr, 255_000);
  assert.equal(bank.taxTreatment, 'unconfirmed');
  assert.equal(bank.failedAttemptFees, 'unconfirmed');
  assert.equal(goPay.payoutFeeRateBeforeTax, 0.01);
  assert.equal(goPay.totalDebitBeforeTaxIdr, 252_500);
});

test('a successful payout must fit principal and pre-tax fee inside the planning budget', () => {
  const affordable = evaluatePayoutPreTaxRequest({
    amountIdr: 250_000,
    payoutFeeIdr: 5_000,
    remainingDistributionBudgetIdr: 255_000,
  });
  const unaffordable = evaluatePayoutPreTaxRequest({
    amountIdr: 250_000,
    payoutFeeIdr: 5_000,
    remainingDistributionBudgetIdr: 250_000,
  });

  assert.equal(affordable.withinPreTaxBudget, true);
  assert.equal(unaffordable.withinPreTaxBudget, false);
});

test('fixed-fee payout thresholds are indicative and calculated before tax', () => {
  assert.equal(minimumPayoutForPreTaxCostRate({ payoutFeeIdr: 5_000, maximumCostRate: 0.03 }), 166_667);
  assert.equal(minimumPayoutForPreTaxCostRate({ payoutFeeIdr: 1_000, maximumCostRate: 0.03 }), 33_334);
});

test('distribution is limited by both the revenue cap and available cash after reserve', () => {
  const budget = calculateDistributionBudget({
    settledNetEligibleRevenueIdr: 850_000,
    cashAvailableIdr: 750_000,
    cashReserveIdr: 100_000,
  });

  assert.equal(budget.revenueLimitedBudgetIdr, 595_000);
  assert.equal(budget.cashAfterReserveIdr, 650_000);
  assert.equal(budget.distributionBudgetIdr, 595_000);
  assert.equal(budget.networkCommissionCapIdr, 238_000);
});

test('invalid amounts and fee ratios are rejected', () => {
  assert.throws(() => estimateMidtransPayoutFeeBeforeTax({ amountIdr: 0, payoutFeeIdr: 5_000 }), TypeError);
  assert.throws(() => estimateMidtransPayoutFeeBeforeTax({ amountIdr: 250_000, payoutFeeIdr: -1 }), TypeError);
  assert.throws(() => minimumPayoutForPreTaxCostRate({ payoutFeeIdr: 5_000, maximumCostRate: 0 }), TypeError);
});
