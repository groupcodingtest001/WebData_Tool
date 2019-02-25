var statuscode = 0

$(document).ready(function () {
    //var ds = dataload01();
    //refresh(ds);
    statuscode = 0;
});

function mouseOver() {
    document.getElementById('imgdspid01').src = "/static/img/excelstart_b.png"
    document.getElementById('paraid01').style.color = '#1296db'
}
function mouseOut() {
    document.getElementById('imgdspid01').src = "/static/img/excelstart.png"
    document.getElementById('paraid01').style.color = "grey"

}


function selectFile02() {
    if ($("#chsfile02").attr("name") == "chsfile02_1") {
        $("#file02").trigger("click");
        var str = "<table id='file_tb02'  class='table' ><thead><tr><th style='width:100px;'>File #</th><th id='fname02'>File Name</th></tr></thead><tbody>";
        $("#file02").on("change", function () {
            var obj = document.getElementById("file02");
            var length = obj.files.length;
            for (var i = 0; i < length; i++) {
                var temp = obj.files[i].name;
                var temp_size = obj.files[i].size / 1024;
                if (temp.substring(temp.lastIndexOf("."), temp.length).toUpperCase() == ".HTML" && temp_size < 10240) {
                    str += "<tr><td style='width:100px;'>" + (i + 1) + "</td><td>" + temp + "</td><tr>";
                }
                else {
                    alert("Tencent DMP file should be with '.html' format and less than 10M in size!");
                    //$('div#start1').modal('toggle');
                    return;
                }
            }
            str += "</tbody></table>"

            $("#filedisplay02").removeClass("modal_files");
            $("#filedisplay02").empty();
            $("#filedisplay02").append(str);
            $("#chsfile02").attr("name", "chsfile02_2");
            $("#chsfile02").text("Upload Tencent Files");
        });
    }
    else {
        var idv = $("#modalLabel").attr("name");
        var fdata02 = new FormData()
        var files = $("#file02").get(0).files;
        for (var i = 0; i < files.length; i++) {
            fdata02.append("file02", files[i]);
        }

        $.ajax({
            type: "POST",
            url: '/up_00',
            data: fdata02,
            contentType: false,
            processData: false,
            success: function (msg) {
                //alert(JSON.stringify(msg));
                $("#chsfile02").hide();
                $("#fname02").empty();
                $("#fname02").append("File Name Uploaded");
                $("#dsubm01").show();
            }
        });
    }
}

$("div#starttaskid01").on("click", function () {
    if (statuscode == 0) {
        var sechtml2_1 = "Please Select Tencent Files";
        var sechtml2_2 = "<input type='file' id='file02' multiple='multiple' style='filter:alpha(opacity=0);opacity:0;width: 0;height: 0;' /><button id='chsfile02' name='chsfile02_1' class='btn btn-primary' onclick='selectFile02();'>Select</button>";
        var sechtml3_1 = "<div id='dsubm01' class='col-lg-offset-2 col-lg-2' style='display:none;'><button id='submit01' class='btn btn-primary'>Submit</button></div><div><button id='cancel1' type='button' class='btn btn-default' onclick='cancel1()'>Cancel</button></div>";
        //before initialization
        $("#filedisplay02").empty();
        $("#filedisplay02").removeClass('modal_files');
        $("#filedbtn02").empty();
        $("#footer01").empty();
        //elements loading
        $("#filedisplay02").append(sechtml2_1);
        $("#filedisplay02").addClass('modal_files');
        $("#filedbtn02").append(sechtml2_2);
        $("#footer01").append(sechtml3_1);
        $('div#start1').modal('toggle');
        $('button#submit01').click(function () {
            statuscode = 1;
            $.ajax({
                type: "PUT",
                url: '/stsup01',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                async: true,
                success: function (msg) {
                    $('div#start1').modal('toggle');
                    $('div#start1sts').modal('toggle');                    
                    $.ajax({
                        type: "POST",
                        url: '/submit01',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        async: true,
                        success: function (msg) {
                            $.ajax({
                                type: "GET",
                                url: '/downloads/',
                                async: false,
                                cache: false,
                                success: function (data) {
                                    statuscode = 0;                               
                                    var blob = new Blob([data], { type: 'application/csv' })
                                    var a = document.createElement('a');
                                    var url = window.URL.createObjectURL(blob);
                                    var filename = 'report_result.csv';
                                    a.style = "display:none";
                                    a.href = url;
                                    a.download = filename;
                                    a.click();
                                    window.URL.revokeObjectURL(url);  
                                    blob.close();
                                    a.remove();                                
                                },
                                error: function (data) {
                                    statuscode = 0; 
                                }
                            })                            
                        },
                        error: function (msg) {
                            statuscode = 0; 
                        }
                    });
                },
                error: function (msg) {
                    statuscode = 0; 
                }
            });
        });
    }
    else {
        $('div#progrs1sts').modal('toggle');
    }
});