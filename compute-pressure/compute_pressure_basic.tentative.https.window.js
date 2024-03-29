'use strict';

promise_test(async t => {
  // The quantization thresholds and the quantized values that they lead to can
  // be represented exactly in floating-point, so === comparison works.

  const update = await new Promise((resolve, reject) => {
    const observer = new PressureObserver(
        resolve, {cpuUtilizationThresholds: [0.5]});
    t.add_cleanup(() => observer.disconnect());
    observer.observe('cpu').catch(reject);
  });

  assert_equals(typeof update.cpuUtilization, 'number');
  assert_greater_than_equal(update.cpuUtilization, 0.0, 'cpuUtilization range');
  assert_less_than_equal(update.cpuUtilization, 1.0, 'cpuUtilization range');
  assert_in_array(update.cpuUtilization, [0.25, 0.75],
                  'cpuUtilization quantization');
}, 'An active PressureObserver calls its callback at least once');

promise_test(async t => {
  const observer1_updates = [];
  const update = await new Promise(async resolve => {
    const observer1 = new PressureObserver(
        update => {observer1_updates.push(update)},
        {cpuUtilizationThresholds: [0.5]});
    await observer1.observe('cpu');

    const observer2 =
        new PressureObserver(resolve, {cpuUtilizationThresholds: [0.5]});
    await observer2.observe('cpu');
  });

  assert_in_array(
      update.cpuUtilization, [0.25, 0.75], 'cpuUtilization quantization')
  assert_in_array(
      observer1_updates[0].cpuUtilization, [0.25, 0.75],
      'cpuUtilization quantization');
}, 'Same quantization should also update second observer');
