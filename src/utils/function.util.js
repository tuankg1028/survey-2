import _ from "lodash";
import csv from "csvtojson";
import bluebird from "bluebird";
import path from "path";
import Logger from "./logger.util";
import readline from "linebyline";
import qs from "qs";
import slug from "slug";
import Models from "../models";
import Services from "../services";
import constants from "./constants";
const dir = bluebird.promisifyAll(require("node-dir"));

const apiGroups= [
  { groupName: 'Keyword', apis: [ 'API' ], mean: 'Mean' },
  {
    groupName: 'Address',
    apis: [ 'android.location', 'com.google.android.gms.location.places' ],
    mean: "By accessing this data, the app can determine the user's address. Moreover, the app can collect fine-grained information, including the user's exact location (longitude, latitude), or the street, as well as coarse grained information, such as the city, or country name."
  },
  {
    groupName: 'Bluetooth connection',
    apis: [ 'android.bluetooth, android.bluetooth.le' ],
    mean: 'By accessing this data, the app wirelessly exchange your data with other Bluetooth devices.'
  },
  {
    groupName: 'Camera',
    apis: [ 'android.hardware.camera2', 'android.hardware.camera2.params' ],
    mean: 'By accessing this data, the app can manage image capture settings, start/stop the image preview, snap pictures, and retrieve frames that are used as the interfaces to preview the displayed pictures.'
  },
  {
    groupName: 'Collection of user data based on peripherals connection via USB port',
    apis: [ 'android.hardware.usb' ],
    mean: 'By accessing this data, the app can access the state of the USB and communicate with connected hardware peripherals.'
  },
  {
    groupName: 'Hardware features',
    apis: [ 'android.hardware' ],
    mean: 'By accessing this data, the app can access the hardware features, such as the screen, camera and other sensors (e.g., accelerometer, GPS, gyroscope).'
  },
  {
    groupName: 'Hardware authenticatoin devices',
    apis: [ 'android.hardware.biometrics', 'android.hardware.fingerprint' ],
    mean: "By accessing this data, the app can access some device's sensors to execute the authentication process via fingerprint or biometric."
  },
  {
    groupName: 'Hardware input devices',
    apis: [ 'android.hardware.input' ],
    mean: 'By accessing this data, the app can access the information about input devices and available keyboard.'
  },
  {
    groupName: 'Hardware display devices',
    apis: [ 'android.hardware.display' ],
    mean: 'By accessing this data, the app can change available display devices.'
  },
  {
    groupName: 'Health and Fitness info',
    apis: [
      'com.google.android.gms.fitness',
      'com.google.android.gms.fitness.data',
      'com.google.android.gms.fitness.request',
      'com.google.android.gms.fitness.result',
      'com.google.android.gms.fitness.service'
    ],
    mean: 'By accessing this data, the app can collect health info such as body temperature, blood glucose, blood pressure, heart rate, etc as well as the fitness info such as outdoor activity, calories burned, step count, etc.'
  },
  {
    groupName: 'Establish wireless communication pair to other devices',
    apis: [
      'android.net',
      'android.net.nsd',
      'android.net.rtp',
      'android.net.sip',
      'android.net.ssl',
      'android.nfc',
      'android.nfc.cardemulation',
      'android.nfc.tech',
      'java.net',
      'javax.net',
      'javax.net.ssl',
      'android.support.v4.net',
      'com.google.android.gms.net'
    ],
    mean: 'By accessing this data, the app can find and pair to other devices though Bluetooth, or NFC connection.'
  },
  {
    groupName: 'Public location',
    apis: [
      'com.google.android.gms.location',
      'com.google.android.gms.maps',
      'com.google.android.gms.maps.model',
      'com.google.android.gms.location.places',
      'com.google.android.gms.location.places.ui'
    ],
    mean: "By accessing this data, the app can collect user's location. Each data point represents the location of the user at the time of the request. Moreover, the app can save the info about the location that users have visited."
  },
  {
    groupName: 'Telephony',
    apis: [
      'android.telephony',
      'android.telephony.cdma',
      'android.telephony.data',
      'android.telephony.euicc'
    ],
    mean: 'By accessing this data, the app can determine the telephony states of the device, including service state, signal strength, message waiting indicator (voicemail). Moreover, the app can send or receive the call or messages.'
  },
  {
    groupName: 'Wifi communication',
    apis: [
      'android.net.wifi',
      'android.net.wifi.aware',
      'android.net.wifi.hotspot2',
      'android.net.wifi.hotspot2.omadm',
      'android.net.wifi.p2p',
      'android.net.wifi.p2p.nsd',
      'android.net.wifi.rtt',
      'android.net.http'
    ],
    mean: 'By accessing this data, the app can collect the state of the Internet connection (e.g., enabled, disabled). Moreover, the app can transfers and receives the data via wifi connection.'
  },
  {
    groupName: 'User profile',
    apis: [
      'com.google.android.gms.plus',
      'com.google.api.services.people.v1',
      'com.google.api.services.people.v1.model'
    ],
    mean: 'By accessing this data, the app can collect basic user info (standard info, such as name, age, gender), or identity info, such as phone number, or user�s interests, such as sports, art, gaming, traveling.'
  },
  {
    groupName: 'TV channel',
    apis: [ 'android.media.tv' ],
    mean: 'By accessing this data, the app can connect/manage the TV devices'
  },
  {
    groupName: 'Audio, Video, Picture files',
    apis: [
      'android.media',
      'android.media.audiofx',
      'android.media.browse',
      'android.media.effect',
      'android.media.midi',
      'android.media.projection',
      'android.media.session',
      'android.service.media',
      'android.provider'
    ],
    mean: 'By accessing this data, the app can manage various audio and video interfaces. Moreover, the app can play and record media files, such as audio files (e.g., play MP3s or other music files, ringtones, game sound effects, or DTMF tones) and video files (e.g., play a video streamed over the web or from local storage).'
  },
  {
    groupName: 'Play/Record the media files',
    apis: [
      'android.support.media',
      'android.support.media.tv',
      'android.support.v17.leanback.media',
      'android.support.v4.media',
      'android.support.v4.media.app',
      'android.support.v4.media.session',
      'android.support.v7.media',
      'androidx.exifinterface.media'
    ],
    mean: 'By accessing this data, the app can play and record media files including audio (e.g., play MP3s or other music files, ringtones, game sound effects, or DTMF tones) and video (e.g., play a video streamed over the web or from local storage).'
  },
  {
    groupName: 'Share media files',
    apis: [
      'androidx.media',
      'androidx.media.session',
      'androidx.media.app',
      'androidx.media.utils'
    ],
    mean: 'By accessing this data, the app can share media contents and controls with other apps.'
  },
  {
    groupName: 'Metadata of media file',
    apis: [
      'androidx.media2.common',
      'androidx.media2.player',
      'androidx.media2.session',
      'androidx.media2.widget',
      'androidx.mediarouter.app',
      'androidx.mediarouter.media'
    ],
    mean: 'By accessing this data, the app can create/read/edit the metadata of media file (e.g., device, time, place).'
  },
  {
    groupName: 'Emergency call',
    apis: [ 'android.telephony.emergency' ],
    mean: 'By accessing this data, the app can retrieve the information of number, service category(s) and country code for a specific emergency number.'
  },
  {
    groupName: 'Global system for mobile communications',
    apis: [ 'android.telephony.gsm', 'android.telephony.gsm' ],
    mean: 'By accessing this data, the app can access GSM-specific telephony features, such as text/data/PDU SMS messages.'
  },
  {
    groupName: 'Group call',
    apis: [ 'android.telephony.mbms' ],
    mean: 'By accessing this data, the app can perform a group call'
  }
]

const personalDataTypes = [
  {
    name: "Connection",
    mean: "By accessing this data, the app can manage the communication with other devices. Moreover, the app can access further info, such as connected network's link speed, IP address of other available devices / networks."
  },

  {
    name: "Healthcare and fitness data",
    mean: "By accessing this data, the app can capture health and fitness data. The app can store data from wearable devices or sensors and access data created by other apps."
  },

  {
    name: "Hardware",
    mean: "By accessing this data, the app can manage device hardware and peripherals, such as cameras, sensors, and USB-installed peripherals."
  },

  {
    name: "Location",
    mean: "By accessing this data, the app can collect user location-related information. Thanks to such data, the app is able to obtain the device's geographical location. Moreover, the app can access to the system location services of the Android platform, so it can collect location-related data such as location tracking, geofencing, and activity recognition."
  },

  {
    name: "Media",
    mean: "By accessing this data, the app can collect media data, including audios, videos, and photos. Moreover, it can create / update photos, and audio files, or record video files to support its services."
  },

  {
    name: "Telephony",
    mean: "By accessing this data, the app can monitor the basic phone info such as the network type and connection state, and provide additional utilities to manipulate phone number strings. "
  },

  {
    name: "User profile",
    mean: "The app collects basic personal data such as full name, age, gender, etc, plus information on social network (e.g., work, education, friend list, family members),  or biometric data."
  }

];
// (async function main() {
//   let data = await csv({
//     noheader: true,
//     output: "csv"
//   }).fromFile("/Users/a1234/Downloads/KeyWorkSearch_New_1_.csv");

//   // console.log(data)
//   const result = []
//   for (let i = 1; i < data.length; i++) {
//     let [id, name, level, parent, keywords] = data[i];
    

//     result.push({
//       id, name, level, parent, keywords: keywords ? keywords.split(",").map(item => item.trim()).filter(item => !!item) : 'null'
//     })
//   }

//   console.log(result)
// }) ()

function getGroupApi (api) {
  let result 
  apiGroups.forEach(apiGroup => {
    apiGroup.apis.forEach(item => {
      if(item === api.name) return result = apiGroup
    })
  })
  return result
}

function getPersonalDataType(personalDataType) {
  return personalDataTypes.find(item => item.name ===personalDataType.name)
} 
function getDAPFile(treeName, subFolder) {
  return (
    folderCSVBaseLineOutput +
    "/" +
    subFolder +
    "/" +
    treeName +
    "_" +
    folderName +
    ".csv"
  );
}

async function getBaseLineByKey(key, firstLevelName, subFolderName) {
  let baseLineData = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(getDAPFile(firstLevelName, subFolderName));

  const [headers, rows] = baseLineData;

  const index = _.indexOf(headers, key);

  return rows[index];
}

async function getAPIFromNode(node) {
  const parent = await Models.Tree.findById(node.parent).cache(
    60 * 60 * 24 * 30
  ); // 1 month;

  if (
    parent.name === "root" ||
    [
      "Connection",
      "Media",
      "Hardware",
      "Health&Fitness",
      "Location",
      "Telephony",
      "UserInfo",
    ].includes(parent.name)
  ) {
    return node;
  }
  return getAPIFromNode(parent);
}


async function creatingTrees(rows, DAP_PATH) {
  // init trees
  let trees = {
    name: "Privacy",
    children: []
  };

  for (let i = 1; i < rows.length; i++) {
    const [
      STT,
      ,
      ,
      firstLevel,
      secondLevel,
      thirdLevel,
      fourthLevel,
      detail,
      group,
      replacedName
    ] = rows[i];

    // exist
    if (firstLevel) {
      // ================== check existing (first) ==================
      var [firstLevelIsExist] = checkExistingInTrees(
        trees,
        firstLevel,
        "first"
      );
      if (!firstLevelIsExist) {
        const firstLevelIndex = trees.children.length;

        // push to children array
        trees.children.push({
          name: firstLevel,
          group,

          children: []
        });
      }

      // exist
      if (secondLevel) {
        // ================== check existing (second) ==================
        var [
          secondLevelIsExist,
          firstLevelIndex,
          secondLevelIndex
        ] = checkExistingInTrees(trees, secondLevel, "second", firstLevel);
        if (!secondLevelIsExist) {
          const details = detail ? [detail.trim()] : [];

          const secondLevelIndex =
            trees.children[firstLevelIndex]["children"].length;

          // push to first level children array
          trees.children[firstLevelIndex]["children"].push({
            name: secondLevel,
            group,
            details,
            replacedName,
            path: `${secondLevelIndex}`,
            children: []
          });
        } else {
          // add detail
          const details =
            trees.children[firstLevelIndex]["children"][secondLevelIndex]
              .details;

          // check detail exist
          if (detail && _.indexOf(details, detail) === -1) {
            details.push(detail);
          }
        }
      }

      // exist
      if (thirdLevel) {
        // ================== check existing (third) ==================
        var [
          thirdLevelIsExist,
          firstLevelIndex,
          secondLevelIndex,
          thirdLevelIndex
        ] = checkExistingInTrees(
          trees,
          thirdLevel,
          "third",
          firstLevel,
          secondLevel
        );
        if (!thirdLevelIsExist) {
          const details = detail ? [detail.trim()] : [];
          const thirdLevelIndex =
            trees.children[firstLevelIndex]["children"][secondLevelIndex][
              "children"
            ].length;
          // push to second level children array
          trees.children[firstLevelIndex]["children"][secondLevelIndex][
            "children"
          ].push({
            name: thirdLevel,
            group,
            details,
            replacedName,
            path: `${secondLevelIndex}.${thirdLevelIndex}`,
            children: []
          });
        } else {
          // add detail
          const details =
            trees.children[firstLevelIndex]["children"][secondLevelIndex][
              "children"
            ][thirdLevelIndex].details;

          // check detail exist
          if (detail && _.indexOf(details, detail) === -1) {
            details.push(detail);
          }
        }

        // exist
        if (fourthLevel) {
          // ================== check existing (third) ==================
          var [
            fourthLevelIsExist,
            firstLevelIndex,
            secondLevelIndex,
            thirdLevelIndex,
            fourthLevelIndex
          ] = checkExistingInTrees(
            trees,
            fourthLevel,
            "fourth",
            firstLevel,
            secondLevel,
            thirdLevel
          );
          if (!fourthLevelIsExist) {
            // add detail
            const details = detail ? [detail.trim()] : [];
            const fourthLevelIndex =
              trees.children[firstLevelIndex]["children"][secondLevelIndex][
                "children"
              ][thirdLevelIndex]["children"].length;

            // push to third level children array
            trees.children[firstLevelIndex]["children"][secondLevelIndex][
              "children"
            ][thirdLevelIndex]["children"].push({
              name: fourthLevel,
              details,
              group,
              replacedName,
              path: `${secondLevelIndex}.${thirdLevelIndex}.${fourthLevelIndex}`
              // children: []
            });
          } else {
            // add detail
            const details =
              trees.children[firstLevelIndex]["children"][secondLevelIndex][
                "children"
              ][thirdLevelIndex]["children"][fourthLevelIndex].details;

            // check detail exist
            if (detail && _.indexOf(details, detail) === -1) {
              details.push(detail);
            }
          }
        }
      }
    }
  }
  return trees;
}
async function creatingTreesWithGroup(rows, DAP_PATH) {
  // init trees
  let trees = {
    name: "Privacy",
    children: []
  };

  for (let i = 1; i < rows.length; i++) {
    const [
      STT,
      ,
      ,
      firstLevel,
      secondLevel,
      thirdLevel,
      fourthLevel,
      detail,
      group,
      replacedName
    ] = rows[i];

    // exist
    if (firstLevel) {
      // ================== check existing (first) ==================
      var [firstLevelIsExist] = checkExistingInTrees(
        trees,
        firstLevel,
        "first"
      );
      if (!firstLevelIsExist) {
        // push to children array
        trees.children.push({
          name: firstLevel,
          group,
          children: []
        });
      }

      // exist
      if (secondLevel) {
        // ================== check existing (second) ==================
        var [
          secondLevelIsExist,
          firstLevelIndex,
          secondLevelIndex
        ] = checkExistingInTrees(trees, secondLevel, "second", firstLevel);
        if (!secondLevelIsExist) {
          // push to first level children array
          trees.children[firstLevelIndex]["children"].push({
            name: secondLevel,
            group,
            children: []
          });
        }
      }

      // exist
      if (thirdLevel) {
        // ================== check existing (third) ==================
        var [
          thirdLevelIsExist,
          firstLevelIndex,
          secondLevelIndex,
          thirdLevelIndex
        ] = checkExistingInTrees(
          trees,
          thirdLevel,
          "third",
          firstLevel,
          secondLevel
        );
        if (!thirdLevelIsExist) {
          // push to second level children array
          trees.children[firstLevelIndex]["children"][secondLevelIndex][
            "children"
          ].push({
            name: thirdLevel,
            group,
            children: []
          });
        }

        // exist
        if (fourthLevel) {
          // ================== check existing (third) ==================
          var [
            fourthLevelIsExist,
            firstLevelIndex,
            secondLevelIndex,
            thirdLevelIndex,
            fourthLevelIndex
          ] = checkExistingInTrees(
            trees,
            fourthLevel,
            "fourth",
            firstLevel,
            secondLevel,
            thirdLevel
          );
          if (!fourthLevelIsExist) {
            // console.log(fourthLevel, group);
            // push to third level children array
            trees.children[firstLevelIndex]["children"][secondLevelIndex][
              "children"
            ][thirdLevelIndex]["children"].push({
              name: fourthLevel,
              group
              // children: []
            });
          }
        }
      }
    }
  }
  return trees;
}
function checkExistingInTrees(
  trees,
  key,
  level,
  firstLevelKey = null,
  secondLevelKey = null,
  thirdLevelKey = null
) {
  const { children } = trees;
  switch (level) {
    // first
    case "first": {
      const firstLevelKeys = _.map(trees.children, "name");

      if (!_.includes(firstLevelKeys, key)) return [false, null];

      break;
    }
    // second
    case "second": {
      // first loop
      for (let i = 0; i < children.length; i++) {
        const { name: firstLevelName, children: firstLevelchildren } = children[
          i
        ];

        // finding parent position
        if (firstLevelName === firstLevelKey) {
          const secondLevelKeys = _.map(firstLevelchildren, "name");

          if (!_.includes(secondLevelKeys, key)) {
            return [false, i];
          } else {
            return [true, i, _.indexOf(secondLevelKeys, key)];
          }
        }
      }

      break;
    }
    // third
    case "third": {
      // first loop
      for (let i = 0; i < children.length; i++) {
        const { name: firstLevelName, children: firstLevelchildren } = children[
          i
        ];

        // finding first level position
        if (firstLevelName === firstLevelKey) {
          for (let j = 0; j < firstLevelchildren.length; j++) {
            const {
              name: sencondLevelName,
              children: sencondLevelchildren
            } = firstLevelchildren[j];

            // finding second level position
            if (sencondLevelName === secondLevelKey) {
              const thirdLevelKeys = _.map(sencondLevelchildren, "name");

              if (!_.includes(thirdLevelKeys, key)) return [false, i, j];
              else {
                return [true, i, j, _.indexOf(thirdLevelKeys, key)];
              }
            }
          }
        }
      }

      break;
    }

    // third
    case "fourth": {
      // first loop
      for (let i = 0; i < children.length; i++) {
        const { name: firstLevelName, children: firstLevelchildren } = children[
          i
        ];

        // finding first level position
        if (firstLevelName === firstLevelKey) {
          for (let j = 0; j < firstLevelchildren.length; j++) {
            const {
              name: sencondLevelName,
              children: sencondLevelchildren
            } = firstLevelchildren[j];

            // finding second level position
            if (sencondLevelName === secondLevelKey) {
              for (let k = 0; k < sencondLevelchildren.length; k++) {
                const {
                  name: thirdLevelName,
                  children: thirdLevelchildren
                } = sencondLevelchildren[k];

                if (thirdLevelName === thirdLevelKey) {
                  const fourthLevelKeys = _.map(thirdLevelchildren, "name");

                  if (!_.includes(fourthLevelKeys, key))
                    return [false, i, j, k];
                  else {
                    return [true, i, j, k, _.indexOf(fourthLevelKeys, key)];
                  }
                }
              }
            }
          }
        }
      }

      break;
    }
  }

  return [true, null];
}

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getRootNamesInTree(tree) {
  return tree.children.map(item => item.name);
}

function getBuildTreeForQuestion(
  rootNames,
  buildTreeHeaders,
  buildTreeRowInApp
) {
  const results = [];
  // loop root names
  for (let i = 0; i < rootNames.length; i++) {
    const rootName = rootNames[i];
    // get index
    const index = _.indexOf(buildTreeHeaders, rootName);
    // get value
    const value = buildTreeRowInApp[index];

    if (value !== "" && value != 0) {
      results.push(
        `${rootName}: The coverage of personal information about ${rootName} is: “${value}”`
      );
    }
  }

  return results;
}

async function createQuestion(
  distanceHeaders,
  distanceRow,
  tree,
  appNameData,
  buildTreeData
) {
  // ================ DATA =======================
  // build tree
  const [buildTreeHeaders, ...buildTreeRows] = buildTreeData;

  const question = {};

  const appId = _.head(distanceRow);
  const appName = _.head(_.last(appNameData[appId]).split(".")); // remove .txt
  const buildTreeRowInApp = buildTreeRows[appId - 1];
  // title
  question.title = `App - ${appName}`;

  // root names in tree
  const rootNames = getRootNamesInTree(tree);

  // get build tree for question
  question.builTree = getBuildTreeForQuestion(
    rootNames,
    buildTreeHeaders,
    buildTreeRowInApp
  );

  // console.log(question.builTree);
  // console.log(rootNames);
  // console.log(question);
}
function getCategoryIdByAppId(appId, distanceRows) {
  const appDistanceRow = getDistanceRowByAppId(appId, distanceRows);
  return _.last(appDistanceRow);
}
function getDistanceRowByAppId(appId, distanceRows) {
  for (let i = 0; i < distanceRows.length; i++) {
    const distanceRow = distanceRows[i];

    const [appIdDT, ...data] = distanceRow;

    if (appId === appIdDT) {
      return data;
    }
  }

  return null;
}
function getCategoryNameByAppId(appId, distanceData, categoryNameData) {
  const categoryId = getCategoryIdByAppId(appId, distanceData);
  const categoryName = getCategoryNameById(categoryId, categoryNameData);

  return categoryName;
}

function getBuildTreeValueOfNodeName(nodeName, appId, buildTreeData) {
  const [buildTreeHeaders, ...buildTreeRows] = buildTreeData;

  for (let i = 0; i < buildTreeRows.length; i++) {
    const [appIdTemp, ...buildTreeRow] = buildTreeRows[i];
    // console.log(appIdTemp);
    if (appId == appIdTemp) {
      const index = _.indexOf(buildTreeHeaders, nodeName);
      return buildTreeRow[index - 1];
    }
  }
}

function getCategoryNameById(categoryId, categoryNameData) {
  const [, ...categoryNameRows] = categoryNameData;

  for (let i = 0; i < categoryNameRows.length; i++) {
    const categoryNameRow = categoryNameRows[i];

    const [categoryIdData, categoryName] = categoryNameRow;

    if (categoryId === categoryIdData) {
      return categoryName;
    }
  }

  return null;
}

async function getDAPValueOfNodeName(rootName, categoryName, DAP_PATH) {
  const filePaths = await dir.filesAsync(DAP_PATH + "/" + categoryName);
  // console.log(filePaths);

  const DAPPath = getFilePathByNodeName(rootName, filePaths);
  const DAPData = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(DAPPath);

  const [DAPHeaders, DAPRows] = DAPData;

  const index = _.indexOf(DAPHeaders, rootName);

  return DAPRows[index];
}
function getFilePathByNodeName(rootName, filePaths) {
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const fileName = path.basename(filePath);
    if (fileName.includes(rootName)) return filePath;
  }
  return null;
}
function getIndexOfSubTree(name, tree) {
  const { children } = tree;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.name === name) return i;
  }

  return null;
}

function getDistanceValue(appId, nodeName, distanceHeaders, distanceRows) {
  const index = _.indexOf(distanceHeaders, nodeName);

  for (let i = 0; i < distanceRows.length; i++) {
    const [appIdTemp, ...distanceRow] = distanceRows[i];
    if (appIdTemp == appId) return distanceRow[index - 1];
  }
}

function getDAPValue(nodeName, distanceHeaders, distanceRows) {
  const index = _.indexOf(distanceHeaders, nodeName);

  return distanceRows[index];
}
function getLeafNodes(nodes, result = []) {
  for (var i = 0, length = nodes.length; i < length; i++) {
    if (!nodes[i].children || nodes[i].children.length === 0) {
      result.push(nodes[i]);
    } else {
      result = getLeafNodes(nodes[i].children, result);
    }
  }
  return result;
}
function getLeafNodesRequiredGroup(nodes, result = []) {
  for (var i = 0, length = nodes.length; i < length; i++) {
    if (!nodes[i].children || nodes[i].children.length === 0) {
      // check node have group
      if (nodes[i].group) {
        result.push(nodes[i]);
      }
    } else {
      result = getLeafNodesRequiredGroup(nodes[i].children, result);
    }
  }
  return result;
}
function getLeafNodesRequiredDetails(nodes, result = []) {
  for (var i = 0, length = nodes.length; i < length; i++) {
    if (!nodes[i].children || nodes[i].children.length === 0) {
      // check node have details
      if (nodes[i].details.length) {
        result.push(nodes[i]);
      }
    } else {
      result = getLeafNodesRequiredDetails(nodes[i].children, result);
    }
  }
  return result;
}
function getDataForLeafNodesDistance(
  appId,
  leafNodes,
  distanceHeaders,
  distanceRows
) {
  const data = [];

  for (let i = 0; i < leafNodes.length; i++) {
    const leafNode = leafNodes[i];
    const { name, details } = leafNode;

    const distanceValue = getDistanceValue(
      appId,
      name,
      distanceHeaders,
      distanceRows
    );

    if (
      details.length === 0 ||
      distanceValue === undefined ||
      distanceValue == 0
    )
      continue;

    data.push({
      name,
      details,
      distanceValue
    });
  }

  return data;
}

function getDataForLeafNodesBuilTree(
  appId,
  leafNodes,
  [distanceHeaders, ...distanceRows]
) {
  const data = [];

  for (let i = 0; i < leafNodes.length; i++) {
    const leafNode = leafNodes[i];
    const { name, details, group, replacedName } = leafNode;

    const buildTreeValue = getDistanceValue(
      appId,
      name,
      distanceHeaders,
      distanceRows
    );

    if (details.length === 0 || buildTreeValue == 0) continue;

    data.push({
      name,
      details,
      group,
      buildTreeValue,
      replacedName
    });
  }

  return data;
}
async function getDataForLeafNodesDAP(
  appId,
  leafNodes,
  rootName,
  categoryName,
  DAP_PATH
) {
  const data = [];

  const filePaths = await dir.filesAsync(DAP_PATH + "/" + categoryName);

  const DAPPath = getFilePathByNodeName(rootName, filePaths);
  const DAPData = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(DAPPath);

  const [DAPHeaders, DAPRows] = DAPData;

  for (let i = 0; i < leafNodes.length; i++) {
    const leafNode = leafNodes[i];
    const { name, details, group } = leafNode;

    const DAPValue = getDAPValue(name, DAPHeaders, DAPRows);

    if (details.length === 0 || DAPValue == 0) continue;

    data.push({
      name,
      details,
      group,
      DAPValue
    });
  }

  return data;
}

function getFileNameByAppId(appId, appNameRows) {
  for (let i = 0; i < appNameRows.length; i++) {
    const [appIdTemp, fileName] = appNameRows[i];

    if (appIdTemp === appId) return fileName;
  }
  return null;
}

function getContentTxtFile(txtFilePath) {
  try {
    let content = "";
    return new Promise((resolve, reject) => {
      let rl = readline(txtFilePath);
      rl.on("line", (line, lineCount, byteCount) => {
        content += line + "/n";
      })
        .on("end", () => {
          resolve(content);
        })
        .on("error", err => {
          reject(err);
        });
    });
  } catch (err) {
    Logger.error("Utils.Function.getContentTxtFile");
    Logger.error(err);
  }
}

async function getPermissions(
  appId,
  categoryName,
  appNameData,
  permissionDataInExcelFile,
  PERRMISSION_FOLDER_PATH
) {
  try {
    const permission = [];

    const [, ...appNameRows] = appNameData;
    const [, ...permissionRows] = permissionDataInExcelFile;
    const fileName = getFileNameByAppId(appId, appNameRows);
    if (!fileName) throw Error(`Cannot find out file by app id ${appId}`);

    const permissionFilePath =
      PERRMISSION_FOLDER_PATH + "/" + categoryName + "/" + fileName;

    let content = await getContentTxtFile(permissionFilePath);
    content = content.split("/n");

    for (let i = 0; i < permissionRows.length; i++) {
      const permissionRow = permissionRows[i];
      const [keyword, detail] = permissionRow;

      const isExisted = checkPermissionInContent(keyword, content);

      if (isExisted) {
        permission.push({
          keyword,
          detail
        });
      }
    }

    return permission;
  } catch (err) {
    console.log(appId);
    Logger.error("Utils.Function.getPermissions");
    Logger.error(err);
  }
}

function checkPermissionInContent(keyword, arrayContent) {
  for (let i = 0; i < arrayContent.length; i++) {
    const content = arrayContent[i].toLowerCase().trim();

    if (content.indexOf(keyword.toLowerCase().trim()) !== -1) return true;
  }
  return false;
}

function objectToArray(objects) {
  let queryString = "";
  for (const key in objects) {
    const value = objects[key];

    queryString += `${key}=${value}&`;
  }
  return qs.parse(queryString);
}
async function getContentGroup(path) {
  try {
    const content = await getContentTxtFile(path);
    const { keywordGroup, descGroup } = getKeywordByContent(content);
    return { keywordGroup, descGroup };
  } catch (err) {
    return { keywordGroup: "", descGroup: "" };
  }
}
function getKeywordByContent(content) {
  let keyword = null;
  let isFound = false;
  const arrayContent = content.split("/n");
  let length = arrayContent.length;
  while (!isFound && length >= 0) {
    const index = length - 1;
    if (
      arrayContent[index].includes("Keywork:") ||
      arrayContent[index].includes("keywork:") ||
      arrayContent[index].includes("Keyword:") ||
      arrayContent[index].includes("keyword:")
    ) {
      const keywordGroup = arrayContent[index]
        .replace("Keywork:", "")
        .replace("keywork:", "")
        .replace("Keyword:", "")
        .replace("keyword:", "")
        .trim();

      const arrayDesc = arrayContent.splice(index, 1);
      const descGroup = _.join(arrayContent, "/n");
      isFound = true;
      return { keywordGroup, descGroup };
    } else {
      length = length - 1;
    }
  }

  return { keywordGroup: "", descGroup: "" };
}
async function getDataForFirstLevel(rootNodeNames, FIRST_LEVEL_FOLDER_PATH) {
  const data = [];
  for (let i = 0; i < rootNodeNames.length; i++) {
    const rootNodeName = rootNodeNames[i];
    try {
      const path = FIRST_LEVEL_FOLDER_PATH + `/${rootNodeName}.txt`;
      const content = await getContentTxtFile(path);
      const { keywordGroup, descGroup } = getKeywordByContent(content);

      data.push({ node: rootNodeName, keywordGroup, descGroup });
    } catch (err) {
      data.push({ node: rootNodeName, keywordGroup: "", descGroup: "" });
    }
  }

  return data;
}
//
async function getDataForQuestion(appId, tree, buildTreeData, meta) {
  try {
    const { categoryName, DAP_PATH, dataForFirstLevel } = meta;
    console.log(appId); // root names in tree
    const nodeData = [];
    const rootNames = getRootNamesInTree(tree);
    for (let i = 0; i < rootNames.length; i++) {
      const rootName = rootNames[i];
      const dateForNode = _.filter(
        dataForFirstLevel,
        item => item.node == rootName
      )[0];

      const { keywordGroup: group, descGroup: description } = dateForNode;

      // get index of tree
      const indexOfTree = getIndexOfSubTree(rootName, tree);
      const subTree = tree.children[indexOfTree];
      // get leaf nodes

      const leafNodes = getLeafNodes(subTree.children);
      if (leafNodes.length === 0) {
        continue;
      }
      // get build tree value
      // const buidTreeValue = getBuildTreeValueOfNodeName(
      //   rootName,
      //   appId,
      //   buildTreeData
      // );

      // get DAP value
      // const DAPValue = await getDAPValueOfNodeName(
      //   rootName,
      //   categoryName,
      //   DAP_PATH
      // );

      // data for leaf nodes distance
      // const leafNodeDataDistance = getDataForLeafNodesDistance(
      //   appId,
      //   leafNodes,
      //   distanceHeaders,
      //   distanceRows
      // );

      // data for leaf nodes distance
      // const leafNodeDataDAP = await getDataForLeafNodesDAP(
      //   appId,
      //   leafNodes,
      //   rootName,
      //   categoryName,
      //   DAP_PATH
      // );
      // data for leaf nodes distance
      let leafNodeDataBuildTree = getDataForLeafNodesBuilTree(
        appId,
        leafNodes,
        buildTreeData
      );
      leafNodeDataBuildTree = _.uniqBy(leafNodeDataBuildTree, "replacedName");
      // console.log(leafNodeDataBuildTree);
      // node
      nodeData.push({
        name: rootName,
        group,
        description,
        // buidTreeValue,
        // DAPValue,
        leafNodeDataBuildTree
        // leafNodeDataDAP
        // leafNodeDataDistance
      });
    }

    return nodeData;
  } catch (err) {
    console.log(err);
  }
}

function createHeaders(trees) {
  let dataForHeaders = [
    {
      name: "AppId",
      group: ""
    }
  ];
  for (let i = 0; i < trees.children.length; i++) {
    const subTree = trees.children[i];

    if (subTree.name == "Time" || subTree.name == "Storage") continue;

    const leafNodes = getLeafNodesRequiredDetails(subTree.children);

    const leafNodeNames = _.map(leafNodes, "name");
    for (let j = 0; j < leafNodeNames.length; j++) {
      const leafNodeName = leafNodeNames[j];

      dataForHeaders.push({
        name: leafNodeName,
        group: slug(subTree.name)
      });
    }

    dataForHeaders.push({
      name: subTree.name,
      group: ""
    });
  }

  const data = dataForHeaders.map(item => {
    return {
      id: slug(item.name),
      title: item.name,
      group: item.group
    };
  });

  data.push({
    id: slug("categories"),
    title: "Categories",
    group: ""
  });

  data.push({
    id: slug("app"),
    title: "Labels",
    group: ""
  });

  return data;
}

async function createHeadersWithGroup(trees) {
  let dataForHeaders = [
    {
      name: "AppId",
      group: "",
      keyword: "AppId",
      firstLevelName: ""
    }
  ];
  for (let i = 0; i < trees.children.length; i++) {
    const subTree = trees.children[i];

    if (subTree.name == "Time" || subTree.name == "Storage") continue;
    const leafNodes = getLeafNodesRequiredGroup(subTree.children);

    const leafNodeGroups = _.groupBy(leafNodes, "group");

    for (const groupName in leafNodeGroups) {
      const groupData = await Models.Group.findOne({
        name: groupName
      }).cache(60 * 60 * 24 * 30);

      if (groupData && groupData.keyword) {
        dataForHeaders.push({
          name: groupName,
          group: groupName,
          keyword: groupData.keyword,
          firstLevelName: subTree.name
        });
      }
    }
  }

  const data = dataForHeaders.map(item => {
    return {
      id: slug(item.name),
      title: item.keyword,
      keyword: item.keyword,
      group: item.group,
      firstLevelName: item.firstLevelName
    };
  });

  data.push({
    id: slug("categories"),
    title: "Categories",
    group: ""
  });

  data.push({
    id: slug("app"),
    title: "Labels",
    group: ""
  });

  return data;
}
function getCategortIdByName(name, data) {
  for (let i = 0; i < data.length; i++) {
    const [stt, categoryName] = data[i];

    if (name === categoryName) return stt;
  }
  return false;
}
async function createRows(apps, categoryNameData, headers) {
  const rows = [];

  // loop app
  for (let i = 0; i < apps.length; i++) {
    const row = [];
    const { name: appName, nodes, appId, response: appValue } = apps[i];
    const appData = await Models.App.findById(appId).cache(60 * 60 * 24 * 30);
    const categoryId = getCategortIdByName(
      appData.categoryName,
      categoryNameData
    );

    row[slug("AppId")] = appData.appId;
    // loop leaf nodes
    for (let j = 0; j < nodes.length; j++) {
      const { name: nodeName, response: nodeValue, leafNodes } = nodes[j];

      // loop leaf nodes
      for (let k = 0; k < leafNodes.length; k++) {
        const { name: leafNodeName, response: leafNodeValue } = leafNodes[k];

        row[slug(leafNodeName)] = leafNodeValue / 5; // leaf nodes
      }
      row[slug(nodeName)] = nodeValue / 5; // first level

      // row[slug(nodeName)] =
      //   nodeValue == 1 || nodeValue == 2 ? 1 : nodeValue == 3 ? 2 : 3; // first level
    }
    row[slug("app")] =
      appValue == 1 || appValue == 2 ? 1 : appValue == 3 ? 2 : 3; // label
    row[slug("categories")] = categoryId; // categories

    rows.push(row);
  }
  const result = computeEmptyNodes(rows, headers);
  return result;
}
async function findGroupForLeafNode(nodeName, leafNodes) {
  const leafNodesWithGroup = [];
  for (let k = 0; k < leafNodes.length; k++) {
    const leafNode = leafNodes[k];

    const nodeData = await Models.Node.findOne({
      name: nodeName,
      "leafNodeDataBuildTree.name": leafNode.name
    }).cache(60 * 60 * 24 * 30);

    // get leafNodeData
    const leafNodeData = _.filter(nodeData.leafNodeDataBuildTree, item => {
      return item.name === leafNode.name;
    })[0];
    // get group data
    const groupData = await Models.Group.findById(leafNodeData.group).cache(
      60 * 60 * 24 * 30
    );

    leafNodesWithGroup.push({
      name: leafNode.name,
      response: leafNode.response,
      group: groupData.name
    });
  }

  return leafNodesWithGroup;
}
async function createRowsFirstLevelAndOneLeafNode(
  apps,
  categoryNameData,
  headers,
  isDefaultRange
) {
  const rows = [];

  const representNodeInGroup = [];
  // loop app
  for (let i = 0; i < apps.length; i++) {
    const row = [];
    const { name: appName, nodes, appId, response: appValue } = apps[i];
    const appData = await Models.App.findById(appId).cache(60 * 60 * 24 * 30);
    const categoryId = getCategortIdByName(
      appData.categoryName,
      categoryNameData
    );

    row[slug("AppId")] = appData.appId;
    // loop leaf nodes
    for (let j = 0; j < nodes.length; j++) {
      const { name: nodeName, response: nodeValue, leafNodes } = nodes[j];
      // loop leaf nodes

      const leafNodesWithGroup = await findGroupForLeafNode(
        nodeName,
        leafNodes
      );

      const leafNodeByGroups = _.groupBy(leafNodesWithGroup, "group");

      // loop group
      for (const groupName in leafNodeByGroups) {
        const leafNodeByGroupValues = leafNodeByGroups[groupName];

        row[slug(groupName)] = isDefaultRange
          ? leafNodeByGroupValues[0].response
          : leafNodeByGroupValues[0].response / 5;
      }

      // row[slug(nodeName)] =
      //   nodeValue == 1 || nodeValue == 2 ? 1 : nodeValue == 3 ? 2 : 3; // first level
    }
    // row[slug("app")] =
    //   appValue == 1 || appValue == 2 ? 1 : appValue == 3 ? 2 : 3; // label [1,3]

    row[slug("app")] = isDefaultRange ? appValue : appValue / 5;
    row[slug("categories")] = categoryId; // categories

    rows.push(row);
  }
  // const result = computeEmptyNodes(rows, headers);

  // first level undefined

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const groups = _.groupBy(headers, "group");

    for (const groupName in groups) {
      if (groupName) {
        // init value if node = undefind
        if (!row[slug(groupName)]) row[slug(groupName)] = 0;
      }
    }
  }
  return rows;
}

function computeEmptyNodes(rows, headers) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const groups = _.groupBy(headers, "group");

    for (const groupName in groups) {
      if (groupName) {
        const leafNodes = groups[groupName];
        let total = 0;

        // get total
        for (let j = 0; j < leafNodes.length; j++) {
          const { id } = leafNodes[j];
          // row[id]: response of leafNode
          if (row[id]) {
            total += row[id];
          }
        }

        const initValue = total / leafNodes.length;
        // assign value
        for (let j = 0; j < leafNodes.length; j++) {
          const { id } = leafNodes[j];
          // row[id]: response of leafNode
          if (!row[id]) {
            row[id] = initValue;
          }
        }

        // init value if node = undefind
        if (!row[slug(groupName)]) row[slug(groupName)] = 1;
      }
    }
  }
  return rows;
}

function computeEmptyNodesDistance(rows, headers) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const groups = _.groupBy(headers, "group");

    for (const groupName in groups) {
      if (groupName) {
        const leafNodes = groups[groupName];
        let total = 0;

        // get total
        for (let j = 0; j < leafNodes.length; j++) {
          const { id } = leafNodes[j];
          // row[id]: response of leafNode
          if (row[id]) {
            total += row[id];
          }
        }

        const initValue = total / (leafNodes.length + 1);
        // assign value
        for (let j = 0; j < leafNodes.length; j++) {
          const { id } = leafNodes[j];
          // row[id]: response of leafNode
          if (!row[id]) {
            row[id] = initValue;
          }
        }

        // firstLevel
        row[slug(groupName)] = initValue;
      }
    }

    // console.log(1, initValue, total, headers.length);
  }
  return rows;
}

function computeEmptyNodesDistanceFirstLevel(rows, headers) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const groups = _.groupBy(headers, "group");

    for (const groupName in groups) {
      if (groupName) {
        const leafNodes = groups[groupName];
        let total = 0;

        // get total
        for (let j = 0; j < leafNodes.length; j++) {
          const { id } = leafNodes[j];
          // row[id]: response of leafNode
          if (row[id]) {
            total += row[id];
          }
        }

        const initValue = total / (leafNodes.length + 1);
        // assign value
        for (let j = 0; j < leafNodes.length; j++) {
          const { id } = leafNodes[j];
          // row[id]: response of leafNode
          if (!row[id]) {
            row[id] = initValue;
          }
        }

        // firstLevel
        row[slug(groupName)] = initValue;
      }
    }

    // init value group
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let total = 0;
      let length = 0;

      const groups = _.groupBy(headers, "group");

      for (const groupName in groups) {
        if (groupName) {
          const value = row[groupName];

          length++;
          if (value) {
            total += value;
          }
        }
      }

      for (const groupName in groups) {
        if (groupName) {
          const value = row[groupName];

          if (!value) {
            row[groupName] = total / length;
          }
        }
      }
    }
    // console.log(1, initValue, total, headers.length);
  }
  return rows;
}

function getComparedNodes(comparingNode, tree) {
  const { name: nodeName, path: nodePath } = comparingNode;

  let arrayPaths = nodePath.split(".");

  let node = tree;

  for (let j = 0; j < arrayPaths.length; j++) {
    const arrayPath = arrayPaths[j];

    node = node.children[arrayPath];
  }

  // if = 1
  if (node && node.baseLine == 1) return { name: node.name, path: nodePath };

  return getComparedNodesBigValue(comparingNode, tree);
}
function getComparedNodesBigValue(comparingNode, tree) {
  const { path: nodePath } = comparingNode;

  if (nodePath && nodePath != "") {
    let arrayPaths = nodePath.split(".");

    let node = tree;

    for (let j = 0; j < arrayPaths.length - 1; j++) {
      const arrayPath = arrayPaths[j];

      node = node.children[arrayPath];
    }

    const childrenNodeValues = node.children.map(item =>
      parseFloat(item.baseLine)
    );

    const bigValue = Math.max(...childrenNodeValues);
    if (bigValue != 0) {
      const indexOfBigValue = _.indexOf(childrenNodeValues, bigValue);

      const parentPath = arrayPaths.slice(0, arrayPaths.length - 1);
      parentPath.push(indexOfBigValue);

      return {
        name: node.children[indexOfBigValue].name,
        path: _.join(parentPath, ".")
      };
    } else {
      return getComparedNodesBigValue(node, tree);
    }
  }
}
function searchTree(element, matchingTitle) {
  if (element.name == matchingTitle) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], matchingTitle);
    }
    return result;
  }
  return null;
}

function initBaseLineValueForTree(tree, baseLineData) {
  const [headers, data] = baseLineData;
  // get index
  let index = _.indexOf(headers, tree.name);

  // get value
  tree.baseLine = index == -1 ? 0 : data[index];

  if (tree.children && tree.children.length > 0) {
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      initBaseLineValueForTree(child, baseLineData);
    }
  }

  return tree;
}

function getCommonNode(comparingNode, comparedNode, tree) {
  const { path: comparingPath } = comparingNode;
  const { path: comparedPath } = comparedNode;

  // if (comparingPath === comparedPath) {
  //   // console.log(comparingNode, comparedNode);
  //   const pathArray = comparingPath.split(".");

  //   const parentPath = pathArray.slice(0, pathArray.length - 1);

  //   let node = tree;

  //   for (let j = 0; j < parentPath.length; j++) {
  //     const arrayPath = parentPath[j];

  //     node = node.children[arrayPath];
  //   }

  //   return {
  //     name: node.name,
  //     path: _.join(parentPath, ".")
  //   };
  // }
  const comparingPathArray = comparingPath.split("."); // path
  const comparedPathArray = comparedPath.split("."); // path

  // ['0', '0', '2']['0', '3', '0']
  // second
  if (
    comparingPathArray[0] &&
    comparedPathArray[0] &&
    comparingPathArray[0] == comparedPathArray[0]
  ) {
    // third
    if (
      comparingPathArray[1] &&
      comparedPathArray[1] &&
      comparingPathArray[1] == comparedPathArray[1]
    ) {
      // fourth
      if (
        comparingPathArray[2] &&
        comparedPathArray[2] &&
        comparingPathArray[2] == comparedPathArray[2]
      ) {
        return {
          name:
            tree.children[comparingPathArray[0]].children[comparingPathArray[1]]
              .children[comparingPathArray[2]].name,
          path: `${comparingPathArray[0]}.${comparingPathArray[1]}.${comparingPathArray[2]}`
        };
      } else {
        return {
          name:
            tree.children[comparingPathArray[0]].children[comparingPathArray[1]]
              .name,
          path: `${comparingPathArray[0]}.${comparingPathArray[1]}`
        };
      }
    } else {
      return {
        name: tree.children[comparingPathArray[0]].name,
        path: `${comparingPathArray[0]}`
      };
    }
  }

  return {
    name: tree.name,
    path: -1
  };
}

function getBaseLineVaLueOfNode(searchedNode, tree) {
  const { path: nodePath } = searchedNode;
  if (nodePath == -1) return tree.baseLine;
  // node root
  if (nodePath == "") return tree.baseLine;

  let arrayPaths = nodePath.split(".");

  let node = tree;

  for (let j = 0; j < arrayPaths.length; j++) {
    const arrayPath = arrayPaths[j];

    node = node.children[arrayPath];
  }

  return node.baseLine;
}

function getDistanceToCommonNode(node) {
  const { path } = node;

  if (path == -1) return 0;

  return path.split(".").length;
}
function getDistanceFromNodeToCommonNode(node, commonNode) {
  if (commonNode.path === -1) return node.path.split(".").length;

  return node.path.split(".").length - commonNode.path.split(".").length;
}
async function createRowsDistance(
  apps,
  { categoryNameData, headers, trees, DAP_PATH }
) {
  const rows = [];

  // loop app
  for (let i = 0; i < apps.length; i++) {
    const row = [];
    const { name: appName, nodes, appId, response: appValue } = apps[i];

    const appData = await Models.App.findById(appId).cache(60 * 60 * 24 * 30);
    const categoryId = getCategortIdByName(
      appData.categoryName,
      categoryNameData
    );

    row[slug("AppId")] = appData.appId;
    // loop leaf nodes
    for (let j = 0; j < nodes.length; j++) {
      const { name: nodeName, response: nodeValue, leafNodes } = nodes[j];

      const baseLineData = await csv({
        noheader: true,
        output: "csv"
      }).fromFile(
        DAP_PATH +
          "/" +
          appData.categoryName +
          "/" +
          nodeName +
          "_GenCSVFile4ML.csv"
      );

      const indexChildTree = _.findIndex(trees.children, ["name", nodeName]);
      const childTree = JSON.parse(
        JSON.stringify(trees.children[indexChildTree])
      );
      initBaseLineValueForTree(childTree, baseLineData);

      // loop leaf nodes
      for (let k = 0; k < leafNodes.length; k++) {
        const { name: leafNodeName } = leafNodes[k];
        let leafNodeValue;

        // comparing node
        const leafNodeInTree = searchTree(childTree, leafNodeName);
        // console.log(leafNodeName, leafNodeInTree, childTree.children[0]);
        const comparedNode = getComparedNodes(leafNodeInTree, childTree);

        if (comparedNode) {
          if (leafNodeInTree.path === comparedNode.path) {
            leafNodeValue = 0;
          } else {
            const commonNode = getCommonNode(
              leafNodeInTree,
              comparedNode,
              childTree
            );

            const vRoot = childTree.baseLine;
            const vCaa = getBaseLineVaLueOfNode(commonNode, childTree);
            const depthCaa = getDistanceToCommonNode(commonNode);
            const vN1 = getBaseLineVaLueOfNode(leafNodeInTree, childTree);
            const vN2 = getBaseLineVaLueOfNode(comparedNode, childTree);

            const disN1 = getDistanceFromNodeToCommonNode(
              leafNodeInTree,
              commonNode
            );
            const disN2 = getDistanceFromNodeToCommonNode(
              comparedNode,
              commonNode
            );

            leafNodeValue =
              (2 * (1 - vRoot) * (1 - vCaa) * depthCaa) /
              ((1 - vN1) * disN1 +
                (1 - vN2) * disN2 +
                2 * (1 - vRoot) * (1 - vCaa) * depthCaa);
            // recordForTree[slug(comparingNode.name)] = result;
          }
        } else {
          leafNodeValue = 1;
        }

        row[slug(leafNodeName)] = leafNodeValue; // leaf nodes
      }
      row[slug(nodeName)] = nodeValue / 5; // first level

      row[slug(nodeName)] =
        nodeValue == 1 || nodeValue == 2 ? 1 : nodeValue == 3 ? 2 : 3; // first level
    }
    row[slug("app")] = appValue; // label
    row[slug("categories")] = categoryId; // categories

    rows.push(row);
  }
  const result = computeEmptyNodesDistance(rows, headers);
  return result;
}

async function createRowsDistanceFirstLevel(
  apps,
  { categoryNameData, headers, trees, DAP_PATH }
) {
  const rows = [];

  // loop app
  for (let i = 0; i < apps.length; i++) {
    const row = [];
    const { name: appName, nodes, appId, response: appValue } = apps[i];

    const appData = await Models.App.findById(appId);
    const categoryId = getCategortIdByName(
      appData.categoryName,
      categoryNameData
    );

    row[slug("AppId")] = appData.appId;
    // loop leaf nodes
    for (let j = 0; j < nodes.length; j++) {
      const { name: nodeName, response: nodeValue, leafNodes } = nodes[j];

      const baseLineData = await csv({
        noheader: true,
        output: "csv"
      }).fromFile(
        DAP_PATH +
          "/" +
          appData.categoryName +
          "/" +
          nodeName +
          "_GenCSVFile4ML.csv"
      );

      const indexChildTree = _.findIndex(trees.children, ["name", nodeName]);
      const childTree = JSON.parse(
        JSON.stringify(trees.children[indexChildTree])
      );
      initBaseLineValueForTree(childTree, baseLineData);

      // loop leaf nodes
      for (let k = 0; k < leafNodes.length; k++) {
        const { name: leafNodeName } = leafNodes[k];
        let leafNodeValue;

        // comparing node
        const leafNodeInTree = searchTree(childTree, leafNodeName);
        // console.log(leafNodeName, leafNodeInTree, childTree.children[0]);
        const comparedNode = getComparedNodes(leafNodeInTree, childTree);

        if (comparedNode) {
          if (leafNodeInTree.path === comparedNode.path) {
            leafNodeValue = 0;
          } else {
            const commonNode = getCommonNode(
              leafNodeInTree,
              comparedNode,
              childTree
            );

            const vRoot = childTree.baseLine;
            const vCaa = getBaseLineVaLueOfNode(commonNode, childTree);
            const depthCaa = getDistanceToCommonNode(commonNode);
            const vN1 = getBaseLineVaLueOfNode(leafNodeInTree, childTree);
            const vN2 = getBaseLineVaLueOfNode(comparedNode, childTree);

            const disN1 = getDistanceFromNodeToCommonNode(
              leafNodeInTree,
              commonNode
            );
            const disN2 = getDistanceFromNodeToCommonNode(
              comparedNode,
              commonNode
            );

            leafNodeValue =
              (2 * (1 - vRoot) * (1 - vCaa) * depthCaa) /
              ((1 - vN1) * disN1 +
                (1 - vN2) * disN2 +
                2 * (1 - vRoot) * (1 - vCaa) * depthCaa);
            // recordForTree[slug(comparingNode.name)] = result;
          }
        } else {
          leafNodeValue = 1;
        }

        row[slug(leafNodeName)] = leafNodeValue; // leaf nodes
      }
      row[slug(nodeName)] = nodeValue / 5; // first level

      row[slug(nodeName)] =
        nodeValue == 1 || nodeValue == 2 ? 1 : nodeValue == 3 ? 2 : 3; // first level
    }
    row[slug("app")] = appValue; // label
    row[slug("categories")] = categoryId; // categories

    rows.push(row);
  }
  const result = computeEmptyNodesDistanceFirstLevel(rows, headers);
  return result;
}

const getAppsCategories = async appIds => {
  const result = [];
  for (let i = 0; i < appIds.length; i++) {
    const appId = appIds[i];

    const appData = await Models.App.findOne({
      appId
    })
      .select(["_id", "category"])
      .cache(60 * 60 * 24 * 30); // 1 month;

    result.push({
      appId,
      categoryId: appData.category
    });
  }

  return result;
};
const getTranningData = async (tranningAppIds, userAnswer) => {
  const tranningApps = await Promise.all(tranningAppIds.map(appId => Models.App.findById(appId)))

  const traningSet = tranningApps.map(tranningApp => {
    let { PPModel, apisModel, id } = tranningApp
    PPModel = JSON.parse(PPModel)
    apisModel = JSON.parse(apisModel)

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if(!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...Object.values(PPModel), ...Object.values(apisModel), label]
  })
  return traningSet
}

const getOurPredictionApproach3 = async (tranningAppIds, userAnswer, question) => {
  const tranningApps = await Promise.all(tranningAppIds.map(appId => Models.App.findById(appId)))

  // app and category
  const appAndCategoryTranning = tranningApps.map((tranningApp, index) => {
    let { id, categoryName } = tranningApp
    const category = Object.entries(constants.categoryGroups).find(item => {
      const subCategories = item[1]

      if(subCategories.includes(categoryName)) return true
      return false
    })[0]

    
    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if(!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [index + 1, Object.keys(constants.categoryGroups).indexOf(category) + 1, label]
  })
  const category = Object.entries(constants.categoryGroups).find(item => {
    const subCategories = item[1]

    if(subCategories.includes(question.categoryName)) return true
    return false
  })[0]
  const appAndCategoryTest = [[appAndCategoryTranning.length + 1, Object.keys(constants.categoryGroups).indexOf(category) + 1, -1]]

  // app and apis 
  const appAndApisTranning = tranningApps.map((tranningApp, index) => {
    let { id, apisModel } = tranningApp

    apisModel = JSON.parse(apisModel)


    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [index + 1, ...Object.values(apisModel), label]
  })
  const appAndApisTest = [[appAndCategoryTranning.length + 1, ...Object.values(question.apisModel), -1]]

  // app and pp 
  const appAndPPTranning = tranningApps.map((tranningApp, index) => {
    let { id, PPModel } = tranningApp

    PPModel = JSON.parse(PPModel)


    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [index + 1, ...Object.values(PPModel), label]
  })
  const appAndPPTest = [[appAndCategoryTranning.length + 1, ...Object.values(question.PPModel), -1]]

  // app and collection 
  const appAndCollectionTrainning = tranningApps.map((tranningApp, index) => {
    let { id, collectionData } = tranningApp

    collectionData = JSON.parse(collectionData || "[]");


    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [index + 1, ...buildDataCollectionAndThirdParty(collectionData, "collection"), label]
  })
  const appAndCollectionTest = [[appAndCategoryTranning.length + 1, ...buildDataCollectionAndThirdParty(question.collectionData, "collection"), -1]]

  // app and third party 
  const appAndThirdPartyTrainning = tranningApps.map((tranningApp, index) => {
    let { id, thirdPartyData } = tranningApp

    thirdPartyData = JSON.parse(thirdPartyData || "[]");


    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [index + 1, ...buildDataCollectionAndThirdParty(thirdPartyData, "thirdParty"), label]
  })
  const appAndThirdPartyTest = [[appAndCategoryTranning.length + 1, ...buildDataCollectionAndThirdParty(question.thirdPartyData, "thirdParty"), -1]]


  // category and pp
  const categoryAndPPTranning = tranningApps.map((tranningApp, index) => {
    let { id, categoryName, PPModel } = tranningApp
    PPModel = JSON.parse(PPModel)


    const category = Object.entries(constants.categoryGroups).find(item => {
      const subCategories = item[1]

      if(subCategories.includes(categoryName)) return true
      return false
    })[0]

    
    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if(!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [Object.keys(constants.categoryGroups).indexOf(category) + 1, ...Object.values(PPModel), label]
  })
  const categoryAndPPTest = [[Object.keys(constants.categoryGroups).indexOf(category) + 1, ...Object.values(question.PPModel), -1]]

  // category and apis
  const categoryAndApisTranning = tranningApps.map((tranningApp, index) => {
    let { id, categoryName, apisModel } = tranningApp
    apisModel = JSON.parse(apisModel)


    const category = Object.entries(constants.categoryGroups).find(item => {
      const subCategories = item[1]

      if (subCategories.includes(categoryName)) return true
      return false
    })[0]


    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [Object.keys(constants.categoryGroups).indexOf(category) + 1, ...Object.values(apisModel), label]
  })
  const categoryAndApisTest = [[Object.keys(constants.categoryGroups).indexOf(category) + 1, ...Object.values(question.apisModel), -1]]

  // category and collection
  const categoryAndCollectionTranning = tranningApps.map((tranningApp, index) => {
    let { id, collectionData, categoryName } = tranningApp
    collectionData = JSON.parse(collectionData || "[]")


    const category = Object.entries(constants.categoryGroups).find(item => {
      const subCategories = item[1]

      if (subCategories.includes(categoryName)) return true
      return false
    })[0]


    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [Object.keys(constants.categoryGroups).indexOf(category) + 1, ...buildDataCollectionAndThirdParty(collectionData, "collection"), label]
  })
  const categoryAndCollectionTest = [[Object.keys(constants.categoryGroups).indexOf(category) + 1, ...buildDataCollectionAndThirdParty(question.collectionData, "collection"), -1]]

  // category and third party
  const categoryAndThirdPartyTranning = tranningApps.map((tranningApp, index) => {
    let { id, thirdPartyData, categoryName } = tranningApp
    thirdPartyData = JSON.parse(thirdPartyData || "[]")

    const category = Object.entries(constants.categoryGroups).find(item => {
      const subCategories = item[1]

      if (subCategories.includes(categoryName)) return true
      return false
    })[0]

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [Object.keys(constants.categoryGroups).indexOf(category) + 1, ...buildDataCollectionAndThirdParty(thirdPartyData, "thirdParty"), label]
  })
  const categoryAndThirdPartyTest = [[Object.keys(constants.categoryGroups).indexOf(category) + 1, ...buildDataCollectionAndThirdParty(question.thirdPartyData, "thirdParty"), -1]]

  // pp and apis
  const PPandApisTranning = tranningApps.map((tranningApp, index) => {
    let { id, apisModel, PPModel } = tranningApp
    PPModel = JSON.parse(PPModel)
    apisModel = JSON.parse(apisModel)

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if(!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...Object.values(PPModel), ...Object.values(apisModel), label]
  })
  const PPandApisTest = [[...Object.values(question.PPModel), ...Object.values(question.apisModel), -1]]

  // pp and collection
  const PPandCollectionTranning = tranningApps.map((tranningApp, index) => {
    let { id, collectionData, PPModel } = tranningApp
    PPModel = JSON.parse(PPModel)
    collectionData = JSON.parse(collectionData || "[]");

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...Object.values(PPModel), ...buildDataCollectionAndThirdParty(collectionData, "collection"), label]
  })
  const PPandCollectionTest = [[...Object.values(question.PPModel), ...buildDataCollectionAndThirdParty(question.collectionData, "collection"), -1]]

  // pp and third party
  const PPandThirdPartyTranning = tranningApps.map((tranningApp, index) => {
    let { id, thirdPartyData, PPModel } = tranningApp
    PPModel = JSON.parse(PPModel)
    thirdPartyData = JSON.parse(thirdPartyData || "[]");

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if(!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...Object.values(PPModel), ...buildDataCollectionAndThirdParty(thirdPartyData, "thirdParty"), label]
  })
  const PPandThirdPartyTest = [[...Object.values(question.PPModel), ...buildDataCollectionAndThirdParty(question.thirdPartyData, "thirdParty"), -1]]

  // apis and collection
  const apisAndCollectionTranning = tranningApps.map((tranningApp, index) => {
    let { id, collectionData, apisModel } = tranningApp
    apisModel = JSON.parse(apisModel)
    collectionData = JSON.parse(collectionData || "[]");

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...Object.values(apisModel), ...buildDataCollectionAndThirdParty(collectionData, "collection"), label]
  })
  const apisAndCollectionTest = [[...Object.values(question.apisModel), ...buildDataCollectionAndThirdParty(question.collectionData, "collection"), -1]]

  // apis and third party
  const apisAndThirdPartyTranning = tranningApps.map((tranningApp, index) => {
    let { id, thirdPartyData, apisModel } = tranningApp
    apisModel = JSON.parse(apisModel)
    thirdPartyData = JSON.parse(thirdPartyData || "[]");

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...Object.values(apisModel), ...buildDataCollectionAndThirdParty(thirdPartyData, "thirdParty"), label]
  })
  const apisAndThirdPartyTest = [[...Object.values(question.apisModel), ...buildDataCollectionAndThirdParty(question.thirdPartyData, "thirdParty"), -1]]

  // collection and third party
  const collectionAndThirdPartyTranning = tranningApps.map((tranningApp, index) => {
    let { id, collectionData, thirdPartyData } = tranningApp
    collectionData = JSON.parse(collectionData || "[]");
    thirdPartyData = JSON.parse(thirdPartyData || "[]");

    const userAnswerQuestion = userAnswer.questions.find(question => question.id === id)
    let questionInstallation = userAnswerQuestion.responses.find(item => item.name === "install")
    if (!questionInstallation)
      questionInstallation = userAnswerQuestion.responses.find(item => item.name === "agreePredict")
    if (!questionInstallation) throw Error("Answer not found")
    const label = questionInstallation.value

    return [...buildDataCollectionAndThirdParty(collectionData, "collection"), ...buildDataCollectionAndThirdParty(thirdPartyData, "thirdParty"), label]
  })
  const collectionAndThirdPartyTest = [[...buildDataCollectionAndThirdParty(question.collectionData, "collection"), ...buildDataCollectionAndThirdParty(question.thirdPartyData, "thirdParty"), -1]]

  const data = await Promise.all([
    // appAndCategory
    Services.Prediction.getPredictEM({
      train: appAndCategoryTranning,
      test: appAndCategoryTest
    }),
    // appAndApis
    Services.Prediction.getPredictEM({
      train: appAndApisTranning,
      test: appAndApisTest
    }),
    // appAndPP
    Services.Prediction.getPredictEM({
      train: appAndPPTranning,
      test: appAndPPTest
    }),
    // appAndCollection
    Services.Prediction.getPredictEM({
      train: appAndCollectionTrainning,
      test: appAndCollectionTest
    }),
    // appAndThirdParty
    Services.Prediction.getPredictEM({
      train: appAndThirdPartyTrainning,
      test: appAndThirdPartyTest
    }),


    // categoryAndPP
    Services.Prediction.getPredictEM({
      train: categoryAndPPTranning,
      test: categoryAndPPTest
    }),
    // categoryAndApis
    Services.Prediction.getPredictEM({
      train: categoryAndApisTranning,
      test: categoryAndApisTest
    }),
    // categoryAndCollection
    Services.Prediction.getPredictEM({
      train: categoryAndCollectionTranning,
      test: categoryAndCollectionTest
    }),
    // categoryAndThirdParty
    Services.Prediction.getPredictEM({
      train: categoryAndThirdPartyTranning,
      test: categoryAndThirdPartyTest
    }),

    // PPandApis
    Services.Prediction.getPredictEM({
      train: PPandApisTranning,
      test: PPandApisTest
    }),
    // PPandColection
    Services.Prediction.getPredictEM({
      train: PPandCollectionTranning,
      test: PPandCollectionTest
    }),
    // PPandThirdParty
    Services.Prediction.getPredictEM({
      train: PPandThirdPartyTranning,
      test: PPandThirdPartyTest
    }),

    // apisAndCollection
    Services.Prediction.getPredictEM({
      train: apisAndCollectionTranning,
      test: apisAndCollectionTest
    }),
    // apisAndThirdParty
    Services.Prediction.getPredictEM({
      train: apisAndThirdPartyTranning,
      test: apisAndThirdPartyTest
    }),

    // collectionAndThirdParty
    Services.Prediction.getPredictEM({
      train: collectionAndThirdPartyTranning,
      test: collectionAndThirdPartyTest
    }),
  ])

  console.log("Result in approach 3", data)


  const YesGroup = data.filter(item => item == 1)
  const NoGroup = data.filter(item => item == 0)
  const MaybeGroup = data.filter(item => item == 2)

  if(YesGroup.length >= NoGroup.length && YesGroup.length >= MaybeGroup ) return 1;
  if(NoGroup.length >= YesGroup.length && NoGroup.length >= YesGroup ) return 0;

  return 2
}

const buildDataCollectionAndThirdParty = (data, type) => {
  let flattendata = {}
  flattenTree(data, "children", flattendata)

  let categories = []
  switch (type) {
    case "collection": {
      categories = constants.categoriesCollection
      break
    }
    case "thirdParty": {
      categories = constants.categoriesThirdParty
      break
    }
  }

  const result = []
  categories.forEach(item => {
    result.push(Object.keys(flattendata).includes(item.name) ? "1" : "0")
  })

  return result
}
const flattenTree = function (tree, key, collection) {
  if (!tree[key] || tree[key].length === 0) return;
  for (var i = 0; i < tree[key].length; i++) {
    var child = tree[key][i]
    collection[child.id] = child;
    bfs(child, key, collection);
  }
  return;
}
const retry = async (func, time) => {
  let counter = 1
  let status = false
  let result

  do {
    try {
      result = await func()
      status = true
    } catch (error) {
      result = error
      counter++
    }
  } while (!status && counter <= time)

  if (!status) throw result

  return result
}
export default {
  retry,
  getAppsCategories,
  createRows,
  createRowsDistanceFirstLevel,
  createRowsDistance,
  createHeaders,
  getDataForFirstLevel,
  getContentGroup,
  getContentTxtFile,
  objectToArray,
  getCategoryNameByAppId,
  creatingTrees,
  checkExistingInTrees,
  createQuestion,
  cloneObject,
  getDataForQuestion,
  getPermissions,
  getLeafNodesRequiredDetails,
  createRowsFirstLevelAndOneLeafNode,
  creatingTreesWithGroup,
  createHeadersWithGroup,
  getLeafNodes,
  getAPIFromNode,
  getGroupApi,
  getPersonalDataType,
  getTranningData,
  getOurPredictionApproach3
};
