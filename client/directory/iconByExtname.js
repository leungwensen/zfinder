/* jshint strict: true, undef: true, unused: true */
/* global define */

define(function() {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var iconByType = {
            archive    : 'fa fa-file-archive-o',
            audio      : 'fa fa-file-audio-o',
            code       : 'fa fa-file-code-o',
            excel      : 'fa fa-file-excel-o',
            image      : 'fa fa-file-image-o',
            pdf        : 'fa fa-file-pdf-o',
            powerpoint : 'fa fa-file-powerpoint-o',
            video      : 'fa fa-file-video-o',
            word       : 'fa fa-file-word-o',
        },
        iconByExtname = {
            // code {
                apollo : iconByType.code,
                basic  : iconByType.code,
                c      : iconByType.code,
                clj    : iconByType.code,
                coffee : iconByType.code,
                cpp    : iconByType.code,
                css    : iconByType.code,
                dart   : iconByType.code,
                erlang : iconByType.code,
                go     : iconByType.code,
                h      : iconByType.code,
                hs     : iconByType.code,
                java   : iconByType.code,
                js     : iconByType.code,
                less   : iconByType.code,
                lisp   : iconByType.code,
                llvm   : iconByType.code,
                lua    : iconByType.code,
                matlab : iconByType.code,
                ml     : iconByType.code,
                mumps  : iconByType.code,
                n      : iconByType.code,
                pascal : iconByType.code,
                pl     : iconByType.code,
                pm     : iconByType.code,
                proto  : iconByType.code,
                py     : iconByType.code,
                r      : iconByType.code,
                rd     : iconByType.code,
                scala  : iconByType.code,
                sh     : iconByType.code,
                sql    : iconByType.code,
                tcl    : iconByType.code,
                tex    : iconByType.code,
                vb     : iconByType.code,
                vhdl   : iconByType.code,
                wiki   : iconByType.code,
                xq     : iconByType.code,
            // }
            // zip {
                '7-zip' : iconByType.archive,
                '7z'    : iconByType.archive,
                ace     : iconByType.archive,
                arj     : iconByType.archive,
                bz2     : iconByType.archive,
                cab     : iconByType.archive,
                gz      : iconByType.archive,
                gzip    : iconByType.archive,
                iso     : iconByType.archive,
                jar     : iconByType.archive,
                lzh     : iconByType.archive,
                rar     : iconByType.archive,
                tar     : iconByType.archive,
                uue     : iconByType.archive,
                z       : iconByType.archive,
                zip     : iconByType.archive,
            // }
            // pdf {
                pdf: iconByType.pdf,
            // }
            // office {
                doc  : iconByType.word,
                docx : iconByType.word,
                xls  : iconByType.excel,
                xlsx : iconByType.excel,
                ppt  : iconByType.powerpoint,
                pptx : iconByType.powerpoint,
            // }
            // image {
                bmp  : iconByType.image,
                gif  : iconByType.image,
                jpeg : iconByType.image,
                jpg  : iconByType.image,
                pic  : iconByType.image,
                png  : iconByType.image,
                tif  : iconByType.image,
            // }
            // audio {
                aac  : iconByType.audio,
                aif  : iconByType.audio,
                amr  : iconByType.audio,
                ape  : iconByType.audio,
                au   : iconByType.audio,
                flac : iconByType.audio,
                m4a  : iconByType.audio,
                mmf  : iconByType.audio,
                mp3  : iconByType.audio,
                ram  : iconByType.audio,
                wav  : iconByType.audio,
                wma  : iconByType.audio,
            // }
            // video {
                avi  : iconByType.video,
                dat  : iconByType.video,
                flv  : iconByType.video,
                mkv  : iconByType.video,
                mod  : iconByType.video,
                mov  : iconByType.video,
                mpeg : iconByType.video,
                mpg  : iconByType.video,
                rmvb : iconByType.video,
                swf  : iconByType.video,
                vob  : iconByType.video,
                wmv  : iconByType.video,
            // }
        };
    return iconByExtname;
});

