'use strict';

const ExecutionArray = ['async', 'sync'];

// https://webmachinelearning.github.io/webnn/#enumdef-mldevicetype
const DeviceTypeArray = ['cpu', 'gpu'];

// unit of least precision (ULP) is the spacing between two consecutive floating-point numbers.
// It is used as a measure of accuracy in numeric calculations.
const ULPTolerance = {
  // for single-precision floating-point
  'float32': {
    'clamp': 0,
    'concat': 0,
    'relu': 0,
    'reshape': 0,
    'slice': 0,
    'split': 0,
    'squeeze': 0,
    'transpose': 0,
  },
};

function sizeOfShape(array) {
  return array.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
}

/**
 * Get bitwise of the given value.
 * @param {number} value
 * @param {string} dataType A data type string, like "float32", "int8",
 *     more data type strings, please see:
 *     https://webmachinelearning.github.io/webnn/#enumdef-mloperandtype
 * @return {number} A 64-bit signed integer.
 */
function getBitwise(value, dataType) {
  const buffer = new ArrayBuffer(8);
  const int64Array = new BigInt64Array(buffer);
  int64Array[0] = value < 0 ? ~BigInt(0) : BigInt(0);
  let typedArray;

  if (dataType === "float32") {
      typedArray = new Float32Array(buffer);
  } else {
      throw new AssertionError(`Data type ${dataType} is not supported`);
  }

  typedArray[0] = value;

  return int64Array[0];
}

/**
 * Assert that each array property in ``actual`` is a number being close enough to the corresponding
 * property in ``expected`` by the acceptable ULP distance ``nulp`` with given ``dataType`` data type.
 *
 * @param {string} op
 * @param {Array} actual - Array of test values.
 * @param {Array} expected - Array of values expected to be close to the values in ``actual``.
 * @param {number} [nulp=0] - A BigInt value indicates acceptable ULP distance, default 0.
 * @param {string} [dataType="float32"] - A data type string, default "float32",
 *     more data type strings, please see:
 *     https://webmachinelearning.github.io/webnn/#enumdef-mloperandtype
 */
function assert_array_approx_equals_ulp(actual, expected, nulp, dataType)
{
  /*
    * Test if two primitive arrays are equal within acceptable ULP distance
    */
  assert_true(actual.length === expected.length,
              `assert_array_approx_equals_ulp actual length ${actual.length} should be equal to expected length ${expected.length}`);
  let actualBitwise, expectedBitwise, distance;
  for (let i = 0; i < actual.length; i++) {
      actualBitwise = getBitwise(actual[i], dataType);
      expectedBitwise = getBitwise(expected[i], dataType);
      distance = actualBitwise - expectedBitwise;
      distance = distance >= 0 ? distance : -distance;
      assert_true(distance <= nulp,
                  `The distance of ${actual[i]} should be close enough to the distance of ${expected[i]} by the acceptable ULP distance ${nulp}, while current they have ${distance} ULP distance`);
  }
}

/**
 * Get target deviceType Array by parsering 'd' param of test URL.
 * @returns {Array} target deviceType Array
 */
function getTargetDeviceTypeArray() {
  // TODO: test in worker
  const params = new URLSearchParams(location.search);
  // 'd' means 'deviceType'
  const deviceTypes = params.getAll('d');
  if (deviceTypes.length === 0) {
    return DeviceTypeArray;
  } else {
    if (deviceTypes.every((t) => DeviceTypeArray.includes(t))) {
      return deviceTypes;
    } else {
      console.error(`Unsupported such ${deviceTypes.filter(t => !DeviceTypeArray.includes(t))} deviceType`);
      return DeviceTypeArray;
    }
  }
}