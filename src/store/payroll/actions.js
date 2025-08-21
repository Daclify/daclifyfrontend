/*
export function someAction (context) {
}
*/
export async function loadPayrollRoutine(
  { dispatch, commit, getters, rootGetters },
  payload
) {
  let payrollcontract = payload.data;
  console.log(payrollcontract);

  if (!payrollcontract) return;
  dispatch("fetchPayments", {
    payrollcontract: payrollcontract,
    vm: payload.vm,
  });
  dispatch("fetchPayrolls", {
    payrollcontract: payrollcontract,
    vm: payload.vm,
  });
}

export async function fetchPayments(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockPayments = [
    {
      id: 1,
      recipient: "guardian1",
      amount: "100.0000 EOS",
      memo: "Monthly salary payment",
      status: "pending",
      created: "2024-01-15T00:00:00.000Z",
      claimed: null,
    },
    {
      id: 2,
      recipient: "guardian2",
      amount: "150.0000 EOS",
      memo: "Project completion bonus",
      status: "claimed",
      created: "2024-01-10T00:00:00.000Z",
      claimed: "2024-01-12T00:00:00.000Z",
    },
    {
      id: 3,
      recipient: "member1",
      amount: "50.0000 EOS",
      memo: "Contribution reward",
      status: "pending",
      created: "2024-01-14T00:00:00.000Z",
      claimed: null,
    },
  ];

  console.log(`using mock payments for ${payload.payrollcontract}`);
  commit("setPayments", mockPayments);
}

export async function fetchUserPayments(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockUserPayments = [
    {
      id: 1,
      recipient: payload.account,
      amount: "100.0000 EOS",
      memo: "Monthly salary payment",
      status: "pending",
      created: "2024-01-15T00:00:00.000Z",
      claimed: null,
    },
    {
      id: 2,
      recipient: payload.account,
      amount: "50.0000 EOS",
      memo: "Contribution reward",
      status: "claimed",
      created: "2024-01-10T00:00:00.000Z",
      claimed: "2024-01-12T00:00:00.000Z",
    },
  ];

  console.log(`using mock user payments for ${payload.account}`);
  return mockUserPayments;
}

export async function fetchPayrolls(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockPayrolls = [
    {
      id: 1,
      name: "Monthly Payroll",
      description: "Regular monthly salary payments",
      status: "active",
      created: "2024-01-01T00:00:00.000Z",
      total_amount: "500.0000 EOS",
      recipient_count: 5,
      total_paid: {
        contract: "eosio.token",
        quantity: "500.0000 EOS",
      },
      pay_permission: {
        actor: "example-dac",
        permission: "owner",
      },
      total_allocated: "300.0000 EOS",
    },
    {
      id: 2,
      name: "Bonus Payroll",
      description: "Performance bonus payments",
      status: "completed",
      created: "2024-01-10T00:00:00.000Z",
      total_amount: "200.0000 EOS",
      recipient_count: 3,
      total_paid: {
        contract: "eosio.token",
        quantity: "200.0000 EOS",
      },
      pay_permission: {
        actor: "example-dac",
        permission: "owner",
      },
      total_allocated: "150.0000 EOS",
    },
  ];

  console.log(`using mock payrolls for ${payload.payrollcontract}`);
  commit("setPayrolls", mockPayrolls);
}
