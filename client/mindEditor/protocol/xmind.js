/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/encoding/json'
], function(
    json
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     * @NOTE: use xmind structure by default
     */
    return {
        encode: function(plainObject) {
            return json.parse(json.stringify(plainObject));
        },
        decode: function(plainObject) {
            return json.parse(json.stringify(plainObject));
        }
    };
});

/*
 * xmind file structure:

{
    "modifiedTime": 1437990656838,
    "sheets": [
        {
            "id": "bfbf0000000000000000000001",
            "theme": "",
            "title": "Główny",
            "modifiedTime": 1437990656838,
            "rootTopic": {
                "hyperlink": "xmind:#afaf040005000000000000a1a1",
                "id": "bfbf0000000000000000000002",
                "isRootTopic": true,
                "labels": [],
                "markers": [],
                "modifiedTime": 1437990649480,
                "notes": "View the Help sheet for info\nwhat you can do with this map",
                "parentId": "",
                "sheetId": "bfbf0000000000000000000001",
                "title": "Projekty",
                "children": [
                    {
                        "hyperlink": "http://info.onet.pl",
                        "id": "afaf02000400000000000000b1",
                        "isRootTopic": false,
                        "labels": [
                            "1"
                        ],
                        "markers": [],
                        "modifiedTime": null,
                        "notes": "",
                        "parentId": "bfbf0000000000000000000002",
                        "sheetId": "bfbf0000000000000000000001",
                        "title": "Elemiątko 1",
                        "type": "attached",
                        "children": [
                            {
                                "hyperlink": "",
                                "id": "afaf040005000000000000a1a1",
                                "isRootTopic": false,
                                "labels": [],
                                "markers": [
                                    "other-people",
                                    "task-5oct"
                                ],
                                "modifiedTime": 1437652761534,
                                "notes": "",
                                "parentId": "afaf02000400000000000000b1",
                                "sheetId": "bfbf0000000000000000000001",
                                "title": "Subelemiątko 1/1",
                                "type": "attached",
                                "children": []
                            },
                        ]
                    },
                ]
            },
            "relationships": [
                {
                    "id": "3edq0vrjjfjahr13dqipivhajd",
                    "sheetId": "bfbf0000000000000000000001",
                    "sourceId": "afaf02000400000000000000b1",
                    "targetId": "bfbf0000000000000000000002",
                    "modifiedTime": 1437812606341,
                    "title": ""
                },
                {
                    "id": "65jedg56rfo8k6iouvagmgdakk",
                    "sheetId": "bfbf0000000000000000000001",
                    "sourceId": "afaf02000400000000000000b1",
                    "targetId": "afaf02001300000000000000b4",
                    "modifiedTime": 1437812632939,
                    "title": ""
                }
            ],
            "legend": {
                "sheetId": "bfbf0000000000000000000001",
                "markerDescriptions": [
                    {
                        "markderId": "task-start",
                        "description": "Dzień dobry"
                    },
                    {
                        "markderId": "other-people",
                        "description": "Do widzenia"
                    }
                ],
                "position": {
                    "x": 393,
                    "y": 169
                },
                "visibility": "visible"
            }
        }
    ]
}
 */
