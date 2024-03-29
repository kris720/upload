/**
 *
 * @type {{createHtml: fcup_alert.createHtml, fcupInit: fcup_alert.fcupInit}}
 */
;
var fcupUpload = {
    isStop:false,
    createHtml:function(serverUrl){
        if($(".upload-mask").length<=0){
            $("body").before('<link rel="stylesheet" href="'+serverUrl+'/css/upload/upload.css"><link rel="stylesheet" href="'+serverUrl+'/css/upload/cropper.min.css"><script src="'+serverUrl+'/js/upload/jquery.fcup.js"></script><script src="'+serverUrl+'/js/upload/cropper.min.js"></script>');
            var html = '<div class="upload-mask">';
            html +='<div class="upload-box " id="upload_box">';
            html +='<div class="title">';
            html +='<p class="p1">温馨提示：裁剪区域不能超出图片区域</p>';
            html +='<button id="sure" class="sure">确定</button>';
            html +='<button id="cancel" class="cancel">取消</button>';
            html +='</div>';
            html +='<div class="containers" id="containers">';
            html +='<div id="crop_area">';
            html +='<img src style="width: 404px" id="upload_imgs">';
            html +='</div></div></div>';
            html +='<div class="upload-content uploading">';
            html +='<div class="tip-type">';
            html +='<p class="progressNumb">0%</p>';
            html +='<div class="progress-box"><span class="progress"></span></div>';
            html +='</div>';
            html +='<div class="upload-btn-block">';
            html +='<span class="upload-btn gray-btn cancelBtn gray-btn">取消上传</span>';
            html +='</div>';
            html +='</div>';
            html +='<div class="upload-content error" >';
            html +='<div class="tip-txt-box"><div class="fail-block"><span class="icon-fail"></span></div>';
            html +='<span class="tip-txt">上传失败</span>';
            html +='</div>';
            html +='<div class="upload-btn-block">';
            html +='<span class="upload-btn gray-btn sureBtn color-btn">确定</span> <span class="upload-btn gray-btn closeBtn gray-btn">取消</span>';
            html +='</div>';
            html +='</div>';
            html +='</div>';
            $("body").append(html);
            fcupUpload.bindEvent();
        }
    },
    //上传进度
    uploading:function (progress) {
        $(".upload-mask").show();
        $(".upload-content").hide();
        $(".uploading").show();
        $(".progressNumb").html(progress);
        $(".progress").css("width",progress);
    },
    //错误提示
    errorTip:function (txt) {
        $(".upload-mask").show();
        $(".upload-content").hide();
        $(".error").show();
        $(".error .tip-txt").html(txt);
    },
    //关闭弹窗
    closeMask:function () {
        $(".upload-mask").hide();
        $(".progress").css("width",0);
    },
//    fc分片上传初始化
    fcupInit:function (upShardSize,upMaxSize,upType,serverUrl,project,fcupUploadCallback) {
        var upShardSize = upShardSize ==""?"2":upShardSize;
        $.fcup({
            upShardSize: upShardSize, //切片大小,(单次上传最大值)单位M，默认2M
            upMaxSize: upMaxSize, //上传文件大小,单位M，不设置不限制
            upUrl: serverUrl+'/upload/index/upload', //分片文件上传接口
            tailoringUpUrl: serverUrl+'/upload/index/tailoring', //图片裁剪文件上传接口
            upType: upType, //jpg,png,jpeg,gif 上传类型检测,用,号分割
            //接口返回结果回调，根据结果返回的数据来进行判断，可以返回字符串或者json来进行判断处理
            project:project,//项目名称
            upCallBack: function (res) {
                // 状态
                var status = res.status;
                // 信息
                var msg = res.msg;
                // url
                var url = res.url+ "?" + Math.random();
                //name
                var name = res.name;

                // 接口返回错误
                if (status == 0) {
                    // 停止上传并且提示信息
                    $.upStop(msg);
                }

                // 还在上传中
                if (status == 1) {
                    console.log(msg);
                }
                // 已经完成了
                if (status == 2) {
                    var data={
                        url:url,
                        name:name
                    };
                    fcupUploadCallback(data);
                }
                // 已经存在提示极速上传完成
                if (status == 3) {
                    this.i2 = res.finish_spot;
                    this.i3 = res.finish_spot;
                    var data={
                        url:url,
                        name:name
                    };
                    fcupUploadCallback(data);
                }
                // 断点续传
                if (status == 4) {
                    this.i2 = res.finish_spot;
                    this.i3 = Number(res.finish_spot)+1;
                }
            },

            // 上传过程监听，可以根据当前执行的进度值来改变进度条
            upEvent: function (num) {
                // num的值是上传的进度，从1到100
                if(fcupUpload.isStop == false){
                    fcupUpload.uploading(num+'%');
                    if(num == 100){
                        setTimeout(function () {
                            fcupUpload.closeMask();
                        },1000);
                    }
                }
            },

            // 发生错误后的处理
            upStop: function (errmsg) {
                this.is_stop = 1;
                fcupUpload.errorTip(errmsg);
            },

            // 开始上传前的处理和回调,比如进度条初始化等
            upStart: function () {
                fcupUpload.uploading("0%");
            }
        });
        //清空file的值
        $("#upInputId").val("");
        $("body #upInputId").trigger("click");

    },

    //事件绑定
    bindEvent:function () {
        //关闭弹窗
        $("body").on("click",".closeBtn",function () {
            fcupUpload.closeMask();
        });

        //点击确定
        $("body").on("click",".sureBtn",function () {
            fcupUpload.closeMask();
        });
        //取消上传
        $("body").on("click",".cancelBtn",function () {
            $.upCancel();
            fcupUpload.isStop = true;
            fcupUpload.closeMask();
        });

        //裁剪取消
        $("#cancel").click(function () {
            $("#upInputId").val("");
            $(".upload-mask").hide();
            $("#upload_box").css('display',' none');
        });
        $("#sure").click(function () { //点击确认
            if(jQuery.imges===''){
                return;
            }
            var croppedCanvas;
            var roundedCanvas;
            if (!jQuery.croppable_flag) {
                return;
            }
            croppedCanvas = jQuery.imges.cropper('getCroppedCanvas');
            roundedCanvas = jQuery.getRoundedCanvas(croppedCanvas);
            jQuery.upEvent(30);
            var data={
                images:roundedCanvas.toDataURL(),
                file_name:jQuery.tailoring_file_name,
                file_md5:jQuery.fileMD5,
                project:jQuery.project
            };
            jQuery.ajax_post(jQuery.tailoringUpUrl,data);
            $(".upload-mask").hide();
            $("#upload_box").hide();
        });
    }
};
$(function () {
    var serverUrl= $("#serverUrl").attr("serverUrl");
    fcupUpload.createHtml(serverUrl);
});

