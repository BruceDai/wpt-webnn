// META: title=test WebNN API sigmoid operation
// META: global=window
// META: variant=?cpu
// META: variant=?gpu
// META: variant=?npu
// META: script=./resources/utils-new.js
// META: timeout=long

'use strict';

const getSigmoidPrecisionTolerance = () => {
  return {metricType: 'ULP', value: 34};
};

const sigmoidTests = [
  {
    "name": "sigmoid float32 1D tensor-debug",
    "graph": {
      "inputs": {
        "sigmoidInput": {
          "data": [
            4.4460320472717285,
            5.954087734222412,
            6.752403259277344,
            0.5524173378944397,
            7.89571475982666,
            9.68780517578125,
            9.207362174987793,
            9.914284706115723,
            9.695253372192383,
            2.4548580646514893,
            1.8606244325637817,
            6.551702976226807,
            9.757600784301758,
            7.282444000244141,
            8.722091674804688,
            2.3673336505889893,
            2.041412353515625,
            0.8734108209609985,
            5.506361484527588,
            6.521358966827393,
            1.422864317893982,
            3.087130546569824,
            0.14603425562381744,
            8.092769622802734
          ],
          "descriptor": {
            "shape": [
              24
            ],
            "dataType": "float32"
          }
        }
      },
      "operators": [
        {
          "name": "sigmoid",
          "arguments": [
            {
              "input": "sigmoidInput"
            }
          ],
          "outputs": "sigmoidOutput"
        }
      ],
      "expectedOutputs": {
        "sigmoidOutput": {
          "data": [
            0.9884108901023865,
            0.9974114894866943,
            0.9988332986831665,
            0.6346962451934814,
            0.9996278285980225,
            0.9999379515647888,
            0.999899685382843,
            0.9999505281448364,
            0.999938428401947,
            0.920915961265564,
            0.8653697371482849,
            0.9985743761062622,
            0.9999421238899231,
            0.9993129968643188,
            0.9998371005058289,
            0.9143021702766418,
            0.8850769996643066,
            0.70545494556427,
            0.9959555864334106,
            0.9985305070877075,
            0.8057870864868164,
            0.9563587307929993,
            0.536443829536438,
            0.9996943473815918
          ],
          "descriptor": {
            "shape": [
              24
            ],
            "dataType": "float32"
          }
        }
      }
    }
  }
];

if (navigator.ml) {
  sigmoidTests.forEach((test) => {
    webnn_conformance_test(buildAndExecuteGraph, getSigmoidPrecisionTolerance, test);
  });
} else {
  test(() => assert_implements(navigator.ml, 'missing navigator.ml'));
}
