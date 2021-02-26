let download_gadget = document.getElementById("download");
let floating_window_open = false;
let fw = document.getElementsByClassName("floating-window")[0];

function _allValues() {
    var out = "";
    for(var b = 0; b < page.elements.length;b+=1) {
        out += page.elements[b].getValue("содержимое") + "\n";
    }
    alert(out);
}

function _firstBigLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function allowed() {
    return !floating_window_open;
}

function TextToHtmlFile(text,name) {
    //return "data:text/html;charset=utf-8," +text +";
}

function download(text,name) {
    download_gadget.href = "data:text/plain;charset=utf-8;filename=name," +encodeURIComponent(text);
    download_gadget.download = name;
    download_gadget.click();
}


function ActivateWindowsAnimations() {
    var windows = document.getElementsByClassName("content-window");
    for(var a = 0; a < windows.length;a+=1) {
        windows[a].style.display = "none";
        windows[a].addEventListener("animationend",function() {
            if(this.classList.contains("disable")) {
                this.style.display = "none";
            }
        });
        windows[a].addEventListener("animationstart",function() {
            if(this.classList.contains("enable")) {
                this.style.display = "block";
            }
        });
    }
}

function Enable(contentwindowid) {
    if(!allowed()) return;
    var content_window = get("#"+ contentwindowid);
    var windows = document.getElementsByClassName("content-window");
    for(var a = 0; a < windows.length;a+=1) {
        if(windows[a].classList.contains("enable")) {
            windows[a].classList.remove("enable");
            windows[a].classList.add("disable");
        }
    }
    content_window.style.display = "block";
    content_window.classList.remove("disable");
    content_window.classList.add("enable");
}

function UpdateAll() {
    $("#name").val(page.title);
    $("#filename").val(page.fileName);
}

function DownloadPage() {
    var str = page.compilate();
    download(str,page.fileName + ".html");

}

function strweight(str) {
    for(var a = 0; a < str.length;a+=1) {
        if(str[a] != ' ' && str[a] != '\n' && str[a] != '') return true;
    }
    return false;
}

function SaveSettings() {
    var name_given = $("#name").val();
    var filename_given = $("#filename").val();
    if(strweight(name_given)) page.title = name_given;
    if(strweight(filename_given)) page.fileName = filename_given;
}

function DeleteChildren(obj) {
    while(obj.firstChild) {
        obj.removeChild(obj.firstChild);
    }
}

function UpdateObjList(id="elementlist") {
    var obj = document.getElementById(id);
    DeleteChildren(obj);
    var innerHtml = "";
    for(var a = 0; a < page.elements.length;a+=1) {
        innerHtml += '<div class="item"><img class="obj-icon" src="icons/' + page.elements[a].type+ '.png"><p>' +page.elements[a].id+'['+ page.elements[a].type+']</p><div class="obj-buttons"><input type="button" style="background-image:url(' +"'"+"icons/arrow.png" + "'"+ ');transform:rotate(-90deg);" onclick="UpperObj(' + a +')"><input type="button" style="background-image:url(' +"'"+"icons/arrow.png" + "'"+ ');transform:rotate(90deg);" onclick="LowerObj(' + a +')"><input type="button" style="background-image:url(' +"'" + 'icons/info.png'+ "'"+')" onclick="OpenObjSettings(' +a +')" class="obj-button"><input type="button"  style="background-image:url(' +"'" + 'icons/delete.png'+ "'"+')" class="obj-button" onclick="DeleteObj('+a+')"></div></div>';
    }
    if(innerHtml == "") {
        innerHtml = '<p class="hidden-text">Нет элементов.</p>';
    }
    obj.innerHTML = innerHtml;
}

function light(value) {
    if(value) {
        $(".content-window").css("filter","brightness(100%)");
        $(".menu").css("filter","brightness(100%)");
    }
    else {
        $(".content-window").css("filter","brightness(35%)");
        $(".menu").css("filter","brightness(35%)");
    }
}

function showcontent(content,content_str=null,width=800,height=500) {
    if(floating_window_open) {
        light(true);
        if(fw.classList.contains("disappear")) fw.classList.remove("disappear");
        if(fw.classList.contains("appear")) fw.classList.remove("appear");
        fw.classList.add("disappear");
        floating_window_open = false;
    }
    else {
        DeleteChildren(fw);
        if($(document).width() > 1400) {
            fw.style.maxWidth = width*($(document).width()/1280) + "px";
            fw.style.maxHeight=height*($(document).height()/689)+"px";
        }
        else {
            fw.style.maxWidth = width + "px";
            fw.style.maxHeight=height+"px";
        }
        if(content != null)
            fw.appendChild(content);
        else
            fw.innerHTML = content_str;
        light(false);
        if(fw.classList.contains("disappear")) fw.classList.remove("disappear");
        if(fw.classList.contains("appear")) fw.classList.remove("appear");
        fw.classList.add("appear");
        floating_window_open = true;
    }   

}

function replacecontent(content,content_str=null) {
    DeleteChildren(fw);
    if(content != null)
        fw.appendChild(content);
    else fw.innerHTML = content_str;
}

var settings_history=[];

function save_settings() {
    settings_history.push(fw.innerHTML);
    //document.getElementById("save-settings").click();
}


function clear_settings() {
    settings_history = [];
}
function load_last_settings() {
    fw.innerHTML = settings_history.pop();
}

//DESIGN//
var design_id = -1;

function UpdateDesignList() {
    var list = get('#designlist');
    DeleteChildren(list);
    var innerHtml = "";
    for(var a = 0; a < page.elements.length;a+=1) {
        innerHtml += '<div class="item"><img class="obj-icon" src="icons/' + page.elements[a].type+ '.png"><p>' +page.elements[a].id+'['+ page.elements[a].type+']</p><div class="obj-buttons"><input type="button" class="obj-button" style="background-image:url(' +"'icons/pen.png'" +')" onclick="EditObjDesign(' + a +')"></div></div>';
    }
    if(innerHtml == "") {
        innerHtml = '<p class="hidden-text">Нет элементов.</p>';
    }
    list.innerHTML = innerHtml;
}

function DeleteDesignAttribute(attr_id) {
    if(design_id==-1 || allowed()) return;
    page.elements[design_id].design.splice(attr_id,1);
    UpdateObjDesignForm();
}

function UpdateObjDesignForm() {
    clear_settings();
    var innerhtml = '<div class="content">';
    innerhtml +='<h1 class="mini-header bigger" style="margin-top:15px">Редактирование дизайна</h1>';
    for(var a = 0; a < page.elements[design_id].design.length;a+=1) {
        var attribute = page.elements[design_id].design[a];
        innerhtml += '<div class="attribute"><h1 class="mini-header">' +_firstBigLetter(attribute.name) +'</h1><input type="button" class="mini-delete-button" onclick="DeleteDesignAttribute(' + a +')"></div>';
        innerhtml += '<input type="text" class="inputfield" value="' +attribute.value +'" id="' +attribute.name + '">';
        innerhtml += "<hr>";
    }
    if(page.elements[design_id].design.length == 0) {
        innerhtml += '<p class="hidden-text" style="position:relative;margin-top:20px;">Нет атрибутов дизайна.<br>Вы можете добавить их по кнопке ниже.</p>';
        innerhtml += "<hr>";
    }
    innerhtml += '<input type="button" class="button" style="width:250px;" value="Добавить" onclick="AddDesignAttribute()">';
    innerhtml += '<input type="button" style="margin-top:10px;width:250px;" class="button" value="Сохранить" onclick="SaveObjDesign()">';
    innerhtml += '<input type="button" style="margin-top:10px;width:250px;height:60px;font-size:20px;white-space:normal;" class="button" value="Применить ко всем элементам этого типа" onclick="ApplyDesignToObjectsOfThisType()">';
    innerhtml += '<input type="button" style="margin-top:10px;width:250px;" class="button last" value="Отмена" onclick="showcontent(null)">';
    innerhtml += "</div>";
    if(!floating_window_open)
        showcontent(null,content_str=innerhtml);
    else
        replacecontent(null,content_str=innerhtml);
}

function EditObjDesign(id) {
    if(!allowed()) return;
    design_id = id;
    UpdateObjDesignForm();
}

function AddDesignAttribute() {
    SaveObjDesign(exit=false,ignore_empty=true);
    var attributeName = AdvancedPrompt("Введите имя аттрибута");
    var exists = false;
    for(var a = 0; a < page.elements[design_id].design.length;a+=1) {
        if(page.elements[design_id].design[a].name == attributeName) {
            exists = true;
            break;
        }
    }
    if(exists || !strweight(attributeName) || attributeName.includes(' ')) {
        AdvancedAlert("Ошибка!");
        return;
    }
    page.elements[design_id].design.push(new DesignAttribute(attributeName,""));
    UpdateObjDesignForm();
}

function SaveObjDesign(exit=true,ignore_empty=false) {
    for(var a = 0; a < page.elements[design_id].design.length;a+=1) {
        var inputfield = get("#" + page.elements[design_id].design[a].name);
        if(!ignore_empty && !strweight(inputfield.value)) {
            page.elements[design_id].design.splice(a,1);
            a-=1;
            continue;
        }
        var layout = inputfield.value;
        layout = layout.replace(/"/g,"'");
        page.elements[design_id].design[a].value = layout;
    }
    if(exit)showcontent(null);
}

function ApplyDesignToObjectsOfThisType() {
    var confirmed = AdvancedConfirm("Вы уверены?");
    if(!confirmed) return;
    SaveObjDesign(exit=false);
    var applied = 0;
    for(var a = 0; a < page.elements.length;a+=1) {
        if(a != design_id && page.elements[a].type==page.elements[design_id].type) {
            page.elements[a].design = copy(page.elements[design_id].design);
            applied+=1;
        }
    }
    if(applied == 0) {
        AdvancedAlert("Не произошло никаких изменений.");
        return;
    }
    AdvancedAlert("Успешно изменён дизайн " + applied + " элементов.");
    showcontent(null);
}


var settings_id = -1;
function OpenObjSettings(id) {
    if(floating_window_open) return;
    clear_settings();
    settings_id = id;
    var innerhtml = '<div class="content">' + $(".elsettings").html();
    innerhtml += '<h1 class="mini-header">ID</h1>';
    innerhtml += '<input type="text" class="inputfield" placeholder="ID элемента" value="' + page.elements[settings_id].id +'" id="ID">';
    for(var a = 0; a < page.elements[id].parameters.length;a+=1) {
        var param = page.elements[id].parameters[a];
        var header = '<h1 class="mini-header">' +_firstBigLetter(param.name) + '</h1>'
        if(typeof param.value === "string" || typeof param.value === "number") {
            innerhtml += header;
            if((param.name == "пункты" ||param.name == "текст" || param.name == "функция" || param.name == "радиокнопки") && page.elements[settings_id].type!='ссылка') innerhtml += '<textarea class="inputfield" style="max-height:200px;min-height:50px;min-width:150px;max-width:400px;" id="' +param.name + '">' +param.value + '</textarea>';
            else innerhtml += '<input type="text" class="inputfield" value="' + param.value +'" id="' +param.name + '">';
            if(param.name == "радиокнопки") innerhtml += '<p class="text-tip">Каждая строка - радиокнопка.</p>';
            else if(param.name == "функция") innerhtml += '<p class="text-tip">Для опытных пользователей! Язык JavaScript</p>';
            else if(param.name == "пункты") innerhtml += '<p class="text-tip">Одна строка - один пункт.</p>';
            else if(param.name == "ссылка") innerhtml += '<p class="text-tip">В редакторе не работает!</p>';
        }
        else if(typeof param.value === "boolean") {
            var checked="";if(param.value == true) checked="checked";
            innerhtml += '<div class="checkbox-div"><input class="checkbox" '+ checked+' type="checkbox" id="' +param.name + '">';
            innerhtml += '<p class="checkbox-label">' +_firstBigLetter(param.name) + '</p></div>';
        }
    }
    //ОТСТУП
    innerhtml += '<h1 class="mini-header">Отступ</h1>';
    innerhtml += '<input type="text" class="inputfield" onfocusout="MarginSettings_Update()" id="MARGIN-VALUE">';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction"  type="radio" id="UNIT-PX">Пиксели</p>';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction"  type="radio" id="UNIT-CM">Сантиметры</p>';
    //ОТСТУП
    innerhtml += '<input type="button" class="button" value="Готово" onclick="ObjSettingsClose()">';
    innerhtml += '<input type="button" style="margin-top:10px;" class="button last" value="Отмена" onclick="showcontent(null)">';
    innerhtml +='</div>';
    showcontent(null,content_str=innerhtml);
    //ОТСТУП
    var margin = page.elements[id].margin.substring(0,page.elements[id].margin.length-2);
    var format = page.elements[id].margin.substring(page.elements[id].margin.length-2,page.elements[id].margin.length);
    get("#MARGIN-VALUE").value = margin;
    if(format == "px") get("#UNIT-PX").checked = true;
    else if(format == "cm") get("#UNIT-CM").checked = true;
    else get("#UNIT-PX").checked = true;
    $('#MARGIN-VALUE').on('change', function(e) {
        $(e.target).val($(e.target).val().replace(/[^\d\.]/g, ''));
      });
    $('#MARGIN-VALUE').on('keypress', function(e) {
        var keys = ['0','1','2','3','4','5','6','7','8','9','.'];
        return keys.indexOf(event.key) > -1;
    });
}

function SaveObjSettings() {
    for(var a = 0; a < page.elements[settings_id].parameters.length;a+=1) {
        var param = page.elements[settings_id].parameters[a];
        var name = param.name;
        if(typeof param.value === "string" || typeof param.value === "number") {
            page.elements[settings_id].setValue(name,document.getElementById(name).value);
        }
        else if(typeof param.value === "boolean") {
            page.elements[settings_id].setValue(name,document.getElementById(name).checked);
        }
    }
    //ОТСТУП
    var margin = get("#MARGIN-VALUE").value;
    var format = "";
    if(get("#UNIT-PX").checked) format = "px";
    else if(get("#UNIT-CM").checked) format = "cm";
    else format = "px";
    if(strweight(margin)) {
        page.elements[settings_id].margin = margin + format;
    }
}

function ObjCreateClose() {
    var objtypes_dropdown = document.getElementById("obj-types-dropdown");
    var id = get("#CREATE-ID").value;
    if(!ValidId(id)) {
        AdvancedAlert("Указан неверный параметр ID.",title="Ошибка");
        return;
    }
    page.addElement(new Element(objtypes_dropdown.value,id));
    UpdateObjList();
    showcontent(null);
}

function NewObj() {
    if(!allowed()) return;
    clear_settings();
    var objtypes_dropdown = document.getElementById("obj-types-dropdown");
    DeleteChildren(objtypes_dropdown);
    for(var a = 0; a < page.elementTypes.length;a+=1) {
        objtypes_dropdown.innerHTML += '<option value="' + page.elementTypes[a] +'">' +page.elementTypes[a] + '</option>'
    }

    var inner_html = '<div class="flex-content" >' + $("#createnewobj").html();
    auto_generated_id = AutoGeneratedId();
    inner_html += '<h1 class="mini-header">ID элемента</h1>'
    inner_html += '<input class="inputfield" style="width:225px;" type="text" placeholder="ID" value="' +auto_generated_id + '" id="CREATE-ID">';
    inner_html += '<input type="button" class="button" value="Создать" onclick="ObjCreateClose()">'
    inner_html += '<input type="button" style="margin-top:10px;" class="button" value="Отмена" onclick="showcontent(null)">'
    inner_html += "</div>";
    showcontent(null,content_str=inner_html,width="400",height="385");
}

function AutoGeneratedId() {
    var auto_generated_id = "object";
    var attempts = 0;
    while(true && page.elements.length > 0) {
        attempts+=1;
        auto_generated_id = "object" + attempts;
        if(GetObjIndexById(auto_generated_id) == -1) break;
    }
    return auto_generated_id;
}

function get(selector) {
    if(selector.charAt(0) == '#') return document.getElementById(selector.slice(1));
    else if(selector.charAt(0) == ".") return document.getElementsByClassName(selector.slice(1))[0];
    return null;
}

function ValidId(id,obj_id=-1) {
    var exist = false;
    for(var a = 0; a < page.elements.length;a+=1) {
        if(a==obj_id) continue;
        if(page.elements[a].id == id) {
            exist = true;
        }
    }
    if(!strweight(id) || id.includes(' ') || exist) {
        return false;
    }
    return true;
}

function ObjSettingsClose() {
    var id_val = get("#ID").value;
    if(id_val != page.elements[settings_id].id) {
        var valid = ValidId(id_val,obj_id=settings_id);
        if(!valid) {
            AdvancedAlert("Указан неверный параметр ID.",title="Ошибка");
            return;
        }
        page.elements[settings_id].id = id_val;
        UpdateObjList();
    }

    SaveObjSettings();
    showcontent(null);
}

function GetObjIndexById(id) {
    for(var a = 0; a < page.elements.length;a+=1) {
        if(page.elements[a].id == id) return a;
    }
    return -1;
}

function UpperObj(id) {
    if(page.elements.length < 2 || id < 1) return;
    var forward_element = page.elements[id-1];
    page.elements[id - 1] = page.elements[id];
    page.elements[id] = forward_element;
    UpdateObjList();
}
function LowerObj(id) {
    if(page.elements.length < 2 || id >= page.elements.length-1) return;
    var back_element = page.elements[id+1];
    page.elements[id + 1] = page.elements[id];
    page.elements[id] = back_element;
    UpdateObjList();
}
function DeleteObj(id) {
    var confirmed = AdvancedConfirm("Вы точно хотите удалить этот элемент?");
    if(!confirmed) return;
    page.elements.splice(id,1);
    UpdateObjList();
}

function InformationCollectSettings() {
    clear_settings();
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header bigger">Сбор информации</h1>'
    if(page.info_collection.enabled) {
        innerhtml += '<h1 class="mini-header">Почта получения данных</h1>';
        innerhtml += '<input type="text" class="inputfield" id="EMAIL" value="' +page.info_collection.email +'">';
        innerhtml += '<p class="article">На вашем сайте появится кнопка "Отправить", нажав которую, WebCreate отправит данные с отмеченных элементов вам на почту, после чего вы сможете распоряжатся полученной информацией. </p>'
        innerhtml += '<input class="button" style="margin-top:25px;" type="button" value="Отключить" onclick="page.info_collection.enabled = false;InformationCollectSettings();">';
        innerhtml += '<input class="button" style="margin-top:10px;" type="button" value="Готово" onclick="InformationCollectSettings_Close()">';
    }
    else {
        innerhtml += '<h1 class="mini-header" style="text-decoration:underline;font-size:37px;">Отключено</h1>';
        innerhtml += '<input class="button" style="margin-top:50px;" type="button" value="Включить" onclick="page.info_collection.enabled = true;InformationCollectSettings();">';
        innerhtml += '<input class="button" style="margin-top:10px;" type="button" value="Готово" onclick="InformationCollectSettings_Close()">';
    }
    innerhtml += "</div>";
    if(floating_window_open)
        replacecontent(null,content_str=innerhtml);
    else
        showcontent(null,content_str=innerhtml);
}

function InformationCollectSettings_Close() {
    if(page.info_collection.enabled) {
        page.info_collection.email = get("#EMAIL").value;
    }
    showcontent(null);
}

function AdvancedAlert(message,title="Элерт") {
    alert(message);
}

function AdvancedConfirm(message,title="Подтвердите действие") {
    return confirm(message);
}

function AdvancedPrompt(message) {
    return prompt(message);
}

function UpdateView() {
    var view = get("#view-field");
    view.srcdoc =page.compilate(editor = true);
}

function BackgroundSettings() {
    clear_settings();
    var innerhtml = '<div class="flex-content">';
    innerhtml += '<h1 class="mini-header biggest" style="margin-bottom:0px">Задний фон</h1>';
    innerhtml += '<h1 class="mini-header" >Типы фона</h1>';
    innerhtml += '<input onclick="OpenColorSettings()" type="button" id="color_button" value="Сплошной цвет" class="typebutton">';
    innerhtml += '<input onclick="OpenGradientSettings()" type="button" id="gradient_button" value="Градиент" class="typebutton">';
    innerhtml += '<input onclick="OpenCenterGradientSettings()" type="button" id="c_gradient_button" value="Центральный градиент" class="typebutton">';
    innerhtml += '<input onclick="OpenImageSettings()" type="button" id="image_button" value="Изображение" class="typebutton">';
    innerhtml += '<input type="button" class="button" onclick="showcontent(null)" value="Готово" style="width:265px">';
    
    innerhtml += "</div>";
    if(!floating_window_open)
        showcontent(null,content_str=innerhtml,width="400",height="460");
    else
        replacecontent(null,content_str=innerhtml);
    var b;
    if(page.background.type == "цвет") {
        b = get("#color_button");
    }
    else if(page.background.type == "градиент") {
        b = get("#gradient_button");
    }
    else if(page.background.type == "центральный градиент") {
        b = get("#c_gradient_button");
    }
    else if(page.background.type == "изображение") {
        b = get("#image_button");
    }
    else return;
    b.style.borderColor="green";
    b.style.borderWidth ="2px";
    b.style.fontWeight="bold";

}

function ColorSettings_ChangeColor(koeff = "") {
    var r = get("#color" + koeff + "-R").value;
    var g = get("#color" + koeff + "-G").value;
    var b = get("#color" + koeff + "-B").value;
    var color_display = get("#color-display" + koeff);
    color_display.style.background="rgb("+r+","+g+","+b+")";
    get("#header" + koeff+"-R").innerHTML = "Красный (" + r + ")";
    get("#header" + koeff+"-G").innerHTML = "Зелёный (" + g + ")";
    get("#header" + koeff+"-B").innerHTML = "Синий (" + b + ")";
}
function ColorSettings_Save() {
    var r = get("#color-R").value;
    var g = get("#color-G").value;
    var b = get("#color-B").value;
    page.background.color = new Color(r,g,b);
    BackgroundSettings();

}
function OpenColorSettings() {
    page.background.type = "цвет";
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header bigger" style="margin-top:10px;">Настройки цвета</h1>';
    innerhtml += '<h1 class="mini-header">Подбор</h1>';
    innerhtml += '<h1 id="header-R" class="range-header">Красный</h1> <input type="range" min="0" max="256" id="color-R" oninput="ColorSettings_ChangeColor()" value="' +page.background.color.r +'">';
    innerhtml += '<h1 id="header-G" class="range-header">Зелёный</h1> <input type="range" min="0" max="256" id="color-G" oninput="ColorSettings_ChangeColor()" value="' +page.background.color.g +'">';
    innerhtml += '<h1 id="header-B"class="range-header">Синий</h1> <input type="range" min="0" max="256" id="color-B" oninput="ColorSettings_ChangeColor()" value="' +page.background.color.b +'">';
    innerhtml += '<div id="color-display" class="color-display"></div>';
    innerhtml += '<input type="button" class="button" value="Готово" onclick="ColorSettings_Save()">';
    innerhtml += '<input type="button" class="button" value="Отмена" style="margin-top:10px;margin-bottom:15px;" onclick="BackgroundSettings()">';
    innerhtml += "</div>";
    replacecontent(null,content_str=innerhtml);

    ColorSettings_ChangeColor();
}
function GradientSettings_Save() {
    var r1 = get("#color1-R").value;
    var g1 = get("#color1-G").value;
    var b1 = get("#color1-B").value;
    var r2 = get("#color2-R").value;
    var g2 = get("#color2-G").value;
    var b2 = get("#color2-B").value;
    page.background.gradientFrom = new Color(r1,g1,b1);
    page.background.gradientTo = new Color(r2,g2,b2);
    var direction = "";
    if(get("#DIRECTION-LEFT").checked) direction="to left";
    else if(get("#DIRECTION-RIGHT").checked)direction="to right";
    else if(get("#DIRECTION-UP").checked) direction="to top";
    else if(get("#DIRECTION-DOWN").checked) direction = "to bottom";
    else if(get("#DIRECTION-CUSTOM").checked) direction = get("#DIRECTION-DEGREES").value + "deg";
    else {
        AdvancedAlert("Ошибка!");
        return;
    }
    page.background.direction = direction;
    BackgroundSettings();
}
function OpenGradientSettings() {

    page.background.type = "градиент";
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header bigger" style="margin-top:10px;">Настройки градиента</h1>';
    innerhtml += '<h1 class="mini-header">Подбор цвета 1</h1>';
    innerhtml += '<h1 id="header1-R" class="range-header">Красный</h1> <input type="range" min="0" max="256" id="color1-R" oninput="ColorSettings_ChangeColor(1)" value="' +page.background.gradientFrom.r +'">';
    innerhtml += '<h1 id="header1-G" class="range-header">Зелёный</h1> <input type="range" min="0" max="256" id="color1-G" oninput="ColorSettings_ChangeColor(1)" value="' +page.background.gradientFrom.g +'">';
    innerhtml += '<h1 id="header1-B"class="range-header">Синий</h1> <input type="range" min="0" max="256" id="color1-B" oninput="ColorSettings_ChangeColor(1)" value="' +page.background.gradientFrom.b +'">';
    innerhtml += '<div id="color-display1" class="color-display"></div>';
    innerhtml += '<h1 class="mini-header">Подбор цвета 2</h1>';
    innerhtml += '<h1 id="header2-R" class="range-header">Красный</h1> <input type="range" min="0" max="256" id="color2-R" oninput="ColorSettings_ChangeColor(2)" value="' +page.background.gradientTo.r +'">';
    innerhtml += '<h1 id="header2-G" class="range-header">Зелёный</h1> <input type="range" min="0" max="256" id="color2-G" oninput="ColorSettings_ChangeColor(2)" value="' +page.background.gradientTo.g +'">';
    innerhtml += '<h1 id="header2-B"class="range-header">Синий</h1> <input type="range" min="0" max="256" id="color2-B" oninput="ColorSettings_ChangeColor(2)" value="' +page.background.gradientTo.b +'">';
    innerhtml += '<div id="color-display2" class="color-display"></div>';
    innerhtml += '<h1 class="mini-header">Направление градиента</h1>';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction" type="radio" id="DIRECTION-RIGHT">Направо</p>';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction" type="radio" id="DIRECTION-LEFT">Налево</p>';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction" type="radio" id="DIRECTION-UP">Вверх</p>';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction" type="radio" id="DIRECTION-DOWN">Вниз</p>';
    innerhtml += '<p class="radio" style="display:inline-block;"><input style="margin-right:5px;" name="direction" type="radio" id="DIRECTION-CUSTOM"></p><input class="mini-inputfield" maxlength="3" type="text" id="DIRECTION-DEGREES"><p class="radio" style="margin:0;display:inline-block;">°</p>';
    innerhtml += '<input type="button" class="button" value="Готово" onclick="GradientSettings_Save()">';
    innerhtml += '<input type="button" class="button" value="Отмена" style="margin-top:10px;margin-bottom:15px;" onclick="BackgroundSettings()">';
    innerhtml += "</div>";
    replacecontent(null,content_str=innerhtml);

    ColorSettings_ChangeColor(1);
    ColorSettings_ChangeColor(2);
    $('#DIRECTION-DEGREES').on('change', function(e) {
        $(e.target).val($(e.target).val().replace(/[^\d\.]/g, ''));
      });
    $('#DIRECTION-DEGREES').on('keypress', function(e) {
        var keys = ['0','1','2','3','4','5','6','7','8','9','.'];
        return keys.indexOf(event.key) > -1;
    });

    if(page.background.direction == "to right")
        get("#DIRECTION-RIGHT").checked= true;
    else if(page.background.direction == "to left")
        get("#DIRECTION-LEFT").checked= true;
    else if(page.background.direction == "to top")
        get("#DIRECTION-UP").checked= true;
    else if(page.background.direction == "to bottom")
        get("#DIRECTION-DOWN").checked= true;
    else if(page.background.direction.endsWith("deg")) {
        get("#DIRECTION-CUSTOM").checked= true;
        get("#DIRECTION-DEGREES").value = page.background.direction.substring(0,page.background.direction.length-3);
    }
    else 
        get("#DIRECTION-RIGHT").checked= true;
}
function CenterGradientSettings_Save() {
    var r1 = get("#color1-R").value;
    var g1 = get("#color1-G").value;
    var b1 = get("#color1-B").value;
    var r2 = get("#color2-R").value;
    var g2 = get("#color2-G").value;
    var b2 = get("#color2-B").value;
    page.background.gradientFrom = new Color(r1,g1,b1);
    page.background.gradientTo = new Color(r2,g2,b2);
    BackgroundSettings();
}
function OpenCenterGradientSettings() {
    page.background.type = "центральный градиент";
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header bigger" style="margin-top:10px;">Настройки градиента</h1>';
    innerhtml += '<h1 class="mini-header">Подбор цвета 1</h1>';
    innerhtml += '<h1 id="header1-R" class="range-header">Красный</h1> <input type="range" min="0" max="256" id="color1-R" oninput="ColorSettings_ChangeColor(1)" value="' +page.background.gradientFrom.r +'">';
    innerhtml += '<h1 id="header1-G" class="range-header">Зелёный</h1> <input type="range" min="0" max="256" id="color1-G" oninput="ColorSettings_ChangeColor(1)" value="' +page.background.gradientFrom.g +'">';
    innerhtml += '<h1 id="header1-B"class="range-header">Синий</h1> <input type="range" min="0" max="256" id="color1-B" oninput="ColorSettings_ChangeColor(1)" value="' +page.background.gradientFrom.b +'">';
    innerhtml += '<div id="color-display1" class="color-display"></div>';
    innerhtml += '<h1 class="mini-header">Подбор цвета 2</h1>';
    innerhtml += '<h1 id="header2-R" class="range-header">Красный</h1> <input type="range" min="0" max="256" id="color2-R" oninput="ColorSettings_ChangeColor(2)" value="' +page.background.gradientTo.r +'">';
    innerhtml += '<h1 id="header2-G" class="range-header">Зелёный</h1> <input type="range" min="0" max="256" id="color2-G" oninput="ColorSettings_ChangeColor(2)" value="' +page.background.gradientTo.g +'">';
    innerhtml += '<h1 id="header2-B"class="range-header">Синий</h1> <input type="range" min="0" max="256" id="color2-B" oninput="ColorSettings_ChangeColor(2)" value="' +page.background.gradientTo.b +'">';
    innerhtml += '<div id="color-display2" class="color-display"></div>';
    innerhtml += '<input type="button" class="button" value="Готово" onclick="CenterGradientSettings_Save()">';
    innerhtml += '<input type="button" class="button" value="Отмена" style="margin-top:10px;margin-bottom:15px;" onclick="BackgroundSettings()">';
    innerhtml += "</div>";
    replacecontent(null,content_str=innerhtml);

    ColorSettings_ChangeColor(1);
    ColorSettings_ChangeColor(2);

}
function ImageSettings_Save() {
    var path = get("#IMAGE-PATH").value;
    if(strweight(path)) page.background.imgPath = path;
    page.background.whitefilter = get("#WHITE-FILTER").checked;
    BackgroundSettings();
}
function ImageSettings_Update() {
    var path = get("#IMAGE-PATH").value;
    var imgPreview = get("#IMAGE-PREVIEW");
    imgPreview.src= path;
    if(get("#WHITE-FILTER").checked)
        imgPreview.style.filter="invert(25%) brightness(150%)";
    else 
        imgPreview.style.filter="none";
}

function OpenImageSettings() {
    page.background.type = "изображение";
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header bigger" style="margin-top:10px;">Настройки изображения</h1>';
    innerhtml += '<h1 class="mini-header">Путь</h1>';
    innerhtml += '<input type="text" class="inputfield" onfocusout="ImageSettings_Update()" id="IMAGE-PATH">';
    innerhtml += '<h1 class="mini-header">Предпросмотр</h1>';
    innerhtml += '<img id="IMAGE-PREVIEW" alt="Ваше изображение">'
    innerhtml += '<div class="checkbox-div"><input class="checkbox" oninput="ImageSettings_Update()" type="checkbox" id="WHITE-FILTER">';
    innerhtml += '<p class="checkbox-label">Применить белый фильтр</p></div>';
    innerhtml += '<input type="button" class="button" value="Готово" onclick="ImageSettings_Save()">';
    innerhtml += '<input type="button" class="button" value="Отмена" style="margin-top:10px;margin-bottom:15px;" onclick="BackgroundSettings()">';
    innerhtml += "</div>";
    replacecontent(null,content_str=innerhtml);
    if(page.background.whitefilter) get("#WHITE-FILTER").checked = true;
    if(strweight(page.background.imgPath)) {
        get("#IMAGE-PATH").value = page.background.imgPath;
        ImageSettings_Update();
    }
}


var burger_menu_activated = false;
function BurgerMenuClick() {
    if(burger_menu_activated == true) {
        get(".side-menu").style.transform = "scale(0.75)";
        get(".side-menu").style.right = "-215px";
        burger_menu_activated=false;
    }
    else {
        get(".side-menu").style.transform = "none";
        get(".side-menu").style.right = "0px";
        burger_menu_activated=true;
    }
}

function Mail(to,subject,text, from="mrkostinilya@yandex.ru",password="Pig66666") {
    Email.send({ 
        Host: "smtp.yandex.ru", 
        Username: from, 
        Password: password, 
        To: to, 
        From: from, 
        Subject: subject, 
        Body: text, 
      }) 
        .then(function (message) { 
          alert("Успешно");
    }); 
}

function AdvancedJSONstringify(obj) {
    return JSON.stringify(obj, function(key, value) {
        if (typeof value === "function") {
          return "/Function(" + value.toString() + ")/";
        }
        return value;
    });
}
function AdvancedJSONparse(json) {
    return JSON.parse(json, function(key, value) {
        if (typeof value === "string" &&
            value.startsWith("/Function(") &&
            value.endsWith(")/")) {
          value = value.substring(10, value.length - 2);
          return (0, eval)("(" + value + ")");
        }
        return value;
    });
}

function PrintElement(element = page) {
    var innerhtml ='<div class="content">';
    innerhtml += '<h1 class="mini-header">Состав сайта</h1>';
    innerhtml += '<p style="font:normal 22px arial;width:95%">' +AdvancedJSONstringify(element) +'</p>';
    innerhtml += '<input type="button" class="button" value="Закрыть" onclick="showcontent(null)">';
    innerhtml +="</div>";
    showcontent(null,content_str=innerhtml);
}

let slot = "1";
function SavePage() {
    localStorage.setItem("slot" + slot,AdvancedJSONstringify(page));
}
function GetSelectedSlot() {
    slot = localStorage.getItem("selected-slot");
    if(slot == null) slot = "1";
}

function NewProject() {
    if(!allowed()) return;
    clear_settings();
    var innerhtml = '<div class="flex-content">';
    innerhtml += '<h1 class="mini-header bigger" >Новый проект</h1>';
    innerhtml += '<h1 class="mini-header">Название</h1>';
    innerhtml += '<input type="text" style="text-align:center" class="inputfield" id="PROJECT-NAME">';
    innerhtml += '<h1 class="mini-header">Предназначение</h1>';
    innerhtml += '<select class="select" id="PROJECT-APPOINTMENT">';
    innerhtml += '<option selected value="статья">Статья</option>';
    innerhtml += '<option value="блог">Блог</option>';
    innerhtml += '<option value="форма">Форма</option>';
    innerhtml += '<option value="другое">Другое</option>';
    innerhtml += '</select>';
    innerhtml += '<input type="button" class="button" value="Создать" onclick="AcceptNewProject()">';
    innerhtml += '<input type="button" class="button" style="margin-top:10px;" value="Отмена" onclick="showcontent(null)">';
    innerhtml += "</div>";
    showcontent(null,content_str=innerhtml,width="370",height="415");
}
function AcceptNewProject() {
    var appointment = get("#PROJECT-APPOINTMENT").value;
    var name = get("#PROJECT-NAME").value;
    if(!strweight(name) || !strweight(appointment)) {
        AdvancedAlert("Ошибка...");
        return;
    }
    var project =  new Project();
    project.slot = (projects.projects.length+1).toString();
    project.name = name;
    project.appointment = appointment;
    projects.projects.push(project);
    projects.save();
    showcontent(null);
    UpdateProjectHolder();
}
function EditProject(id) {
    localStorage.setItem("selectedslot",projects.projects[id].slot);
    document.location = "index.html";
}
function DeleteProject(id_) {
    if(!AdvancedConfirm("Вы точно хотите удалить этот проект?")) return;
    var id = parseInt(id_);
    localStorage.removeItem("slot" + projects.projects[id].slot);
    if(id+1 < projects.projects.length) {
        for(var a = id+1;a<projects.projects.length;a+=1) {
            var slot = parseInt(projects.projects[a].slot);
            var json = localStorage.getItem("slot" + slot);
            localStorage.removeItem("slot" + slot);
            if(json !=null)
            localStorage.setItem("slot" + (slot-1),json);
            projects.projects[a].slot = (slot-1).toString();
        }
    }
    projects.projects.splice(id,1);
    projects.save();
    UpdateProjectHolder();
}
function SaveProjectSettings(id_) {
    var id = parseInt(id_);
    var appointment = get("#PROJECT-APPOINTMENT").value;
    var name = get("#PROJECT-NAME").value;
    if(!strweight(name) || !strweight(appointment)) {
        AdvancedAlert("Ошибка...");
        return;
    }
    projects.projects[id].name = name;
    projects.projects[id].appointment = appointment;
    projects.save();
    showcontent(null);
    UpdateProjectHolder();
}

function ProjectSettings_loadfromfile_changed(id_) {
    try {
        var id=parseInt(id_);
        var file = get("#PROJECT-FROM-FILE").files[0];
        var reader = new FileReader();
        reader.readAsText(file,'CP1251');
        reader.onloadend = function() {
            var str = reader.result;
            localStorage.setItem("slot" + id,str);
            AdvancedAlert("Успешно!");
        }
    }catch{
        AdvancedAlert("Что-то пошло не так...");
    }
    load_last_settings();
}

function ProjectSettings_loadfromfile(id_) {
    var id = parseInt(id_);
    save_settings();
    var innerhtml = '<div class="flex-content">';
    innerhtml +='<h1 class="mini-header middle">Загрузить из файла</h1>';
    innerhtml += '<h1 class="mini-header">Выберите файл</h1>';
    innerhtml += '<input type="file" id="PROJECT-FROM-FILE" class="filemanager" onchange="ProjectSettings_loadfromfile_changed(' + id+')">';
    innerhtml += '<h1 style="margin-top:5px;margin-bottom:5px;" class="mini-header">или</h1> ';
    innerhtml += '<p class="filezone">Перенесите файл сюда</p>';
    innerhtml += '<input type="button" class="button" value="Отмена" onclick="load_last_settings()">';
    innerhtml += '</div>';
    replacecontent(null,content_str=innerhtml);
    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }    
    function handleFileSelect(evt) {
        try {
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.dataTransfer.files;
            var reader = new FileReader();
            reader.readAsText(files[0],'CP1251');
            reader.onloadend = function() {
                var str = reader.result;
                localStorage.setItem("slot" + id,str);
                AdvancedAlert("Успешно!");
            }
        }catch {
            AdvancedAlert("Что-то пошло не так...");
        }
        load_last_settings();
    }
    get(".filezone").addEventListener('dragover', handleDragOver, false);
    get(".filezone").addEventListener('drop', handleFileSelect, false);
}

function ProjectSettings(id_) {
    var id = parseInt(id_);
    if(!allowed()) return;
    clear_settings();
    var innerhtml = '<div class="flex-content">';
    innerhtml += '<h1 class="mini-header middle">Настройки проекта</h1>';
    innerhtml += '<h1 class="mini-header">Название</h1>';
    innerhtml += '<input type="text" id="PROJECT-NAME" class="inputfield" value="' +  projects.projects[id].name+'">';
    innerhtml += '<h1 class="mini-header">Назначение</h1>';
    innerhtml += '<select class="select" id="PROJECT-APPOINTMENT" >';
    innerhtml += '<option value="статья">Статья</option>';
    innerhtml += '<option value="блог">Блог</option>';
    innerhtml += '<option value="форма">Форма</option>';
    innerhtml += '<option value="другое">Другое</option>';
    innerhtml += '</select>';
    innerhtml += '<input type="button" class="button" value="Сохранить" onclick="SaveProjectSettings(' +id +')">';
    innerhtml += '<input type="button" class="button" style="margin-top:10px;" value="Скачать" onclick="projects.projects['+id+'].download()">';
    innerhtml += '<input type="button" class="button smallfont" style="margin-top:10px;" value="Загрузить из файла" onclick="ProjectSettings_loadfromfile('+id+')">';
    innerhtml += '<input type="button" class="button" style="margin-top:10px;" value="Удалить" onclick="SaveProjectSettings(' +id +')">';
    innerhtml += '<input type="button" class="button" style="margin-top:10px;" value="Назад" onclick="showcontent(null)">';
    innerhtml += '</div>';
    showcontent(null,content_str=innerhtml,width="430",height="545");
    //appointment
    var select = get("#PROJECT-APPOINTMENT");
    var selected = false;
    for(var a = 0; a < select.children.length;a+=1) {
        if(select.children[a].value == projects.projects[id].appointment) {
            select.children[a].selected = true;
            selected = true;
        }
    }
    if(!selected) select.children[0].selected = true;

}

function UpdateProjectHolder() {
    var ph = get(".project-holder");
    DeleteChildren(ph);
    var innerhtml = "";
    for(var a = 0; a < projects.projects.length;a+=1) {
        innerhtml +='<div class="projectFrame"><div class="imgShell"><img class="projectFrameImage" src="previews/'+ projects.projects[a].appointment+'.png"><div class="action-holder"><div class="button-holder"><input onclick="ProjectSettings(' + a+ ')" onmouseover="get(' + "'"+'#actionTip' +a + "'"+').style.opacity= ' + "'"+'100%' + "'"+';get(' + "'"+'#actionTip' + a + "'"+').innerHTML=' + "'"+'Настройки' + "'"+'" onmouseout="get(' + "'"+'#actionTip'+a + "'"+').style.opacity=' + "'"+'0%' + "'"+'" class="projectFrameButton" type="button" style="background-image:url(' + "'"+'icons/settings.png' + "'"+')"><input onclick="EditProject(' + a +')" onmouseover="get(' + "'"+'#actionTip'+ a + "'"+').style.opacity= ' + "'"+'100%' + "'"+';get(' + "'"+'#actionTip'+a + "'"+').innerHTML=' + "'"+'Редактировать' + "'"+'" onmouseout="get(' + "'"+'#actionTip'+a + "'"+').style.opacity=' + "'"+'0%' + "'"+'" class="projectFrameButton" type="button" style="background-image:url(' + "'"+'icons/edit.png' + "'"+')"><input onclick="DeleteProject(' + a +')" onmouseover="get(' + "'"+'#actionTip'+a + "'"+').style.opacity= ' + "'"+'100%' + "'"+';get(' + "'"+'#actionTip'+a + "'"+').innerHTML=' + "'"+'Удалить' + "'"+'" onmouseout="get(' + "'"+'#actionTip'+a + "'"+').style.opacity=' + "'"+'0%' + "'"+'" class="projectFrameButton" type="button" style="background-image:url(' + "'"+'icons/trash.png' + "'"+')"></div><p class="actionTip" id="actionTip' + a +'">Действие</p></div></div><a onclick="EditProject(' + a +')">' + projects.projects[a].name+ '</a></div>';
    }
    innerhtml += '<div style="cursor:pointer" onclick="NewProject()" class="projectFrame"><img style="margin-top:5px;width:96%;height:85%;" class="projectFrameImage" src="previews/new_site.png"><a>Новый сайт</a></div>';
    ph.innerHTML = innerhtml;
}

function Message(text) {
    var title =get('.alert-title');
    title.innerHTML = text;
    if(title.classList.contains("appear")) title.classList.remove("appear");
    void title.offsetWidth;
    title.classList.add("appear");
}
function MarginSettings_Save() {
    var margin = get("#MARGIN-VALUE").value;
    var format = "";
    if(get("#UNIT-PX").checked) format = "px";
    else if(get("#UNIT-CM").checked) format = "cm";
    else format = "px";
    if(strweight(margin)) {
        page.objectMargin = margin + format;
        if(get("#ACCEPT-FOR-ALL").checked) {
            for(var a = 0; a < page.elements.length;a+=1) {
                page.elements[a].margin =page.objectMargin;
            }
        }
    }
    showcontent(null);
}
function MarginSettings_Update() {
    var margin = get("#MARGIN-VALUE").value;
    var format = "";
    if(get("#UNIT-PX").checked) format = "px";
    else if(get("#UNIT-CM").checked) format = "cm";
    else format = "px";
    get("#MARGIN-PREVIEW-ELEMENT").style.marginTop = margin+format;
}
function OpenMarginSettings() {
    clear_settings();
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header middle" style="margin-top:15px;">Отступ элементов</h1>';
    innerhtml += '<h1 class="mini-header">Значение</h1>';
    innerhtml += '<input type="text" class="inputfield" onfocusout="MarginSettings_Update()" id="MARGIN-VALUE">';
    innerhtml += '<p class="radio"> <input style="margin-right:5px;"  name="direction" oninput="MarginSettings_Update()" type="radio" id="UNIT-PX">Пиксели</p>';
    innerhtml += '<p class="radio"><input style="margin-right:5px;" name="direction" oninput="MarginSettings_Update()" type="radio" id="UNIT-CM">Сантиметры</p>';
    innerhtml += '<h1 class="mini-header" style="margin-top:8px">Предпросмотр</h1>';
    //YAAAAAAAY 1000 СТРОКА
    innerhtml += '<div style="display:flex;flex-direction:column;align-items:center;overflow:hidden;width:90%;max-width:250px;background:#ececec;min-height:100px;height:auto;border:solid 1px black;" id="MARGIN-PREVIEW">';
    innerhtml += '<div style="margin-bottom:0;margin-top:7px;border:solid 1px black;height:35px;width:70%;max-width:200px;display:flex;justify-content:center;align-items:center"><p style="cursor:default;user-select:none;font:normal 22px arial;">ЭЛЕМЕНТ 1</p></div>';
    innerhtml += '<div id="MARGIN-PREVIEW-ELEMENT"style="margin-bottom:7px;margin-top:7px;border:solid 1px black;height:35px;width:70%;max-width:200px;display:flex;justify-content:center;align-items:center"><p style="cursor:default;user-select:none;font:normal 22px arial;">ЭЛЕМЕНТ 2</p></div>';
    innerhtml += '</div>';
    innerhtml += '<div class="checkbox-div"><input class="checkbox" type="checkbox" checked id="ACCEPT-FOR-ALL">';
    innerhtml += '<p style="font-size:20px;" class="checkbox-label">Применить для всех элементов</p></div>';
    innerhtml += '<input type="button" class="button" value="Готово" onclick="MarginSettings_Save()">';
    innerhtml += '<input type="button" class="button" value="Отмена" style="margin-top:10px;margin-bottom:15px;" onclick="showcontent(null)">';
    innerhtml += '</div>';
    showcontent(null,content_str=innerhtml,width="400");
    
    var margin = page.objectMargin.substring(0,page.objectMargin.length-2);
    var format = page.objectMargin.substring(page.objectMargin.length-2,page.objectMargin.length);
    get("#MARGIN-VALUE").value = margin;
    if(format == "px") get("#UNIT-PX").checked = true;
    else if(format == "cm") get("#UNIT-CM").checked = true;
    else get("#UNIT-PX").checked = true;
    
    MarginSettings_Update();
    $('#MARGIN-VALUE').on('change', function(e) {
        $(e.target).val($(e.target).val().replace(/[^\d\.]/g, ''));
      });
    $('#MARGIN-VALUE').on('keypress', function(e) {
        var keys = ['0','1','2','3','4','5','6','7','8','9','.'];
        return keys.indexOf(event.key) > -1;
    });
}
function IconSettings_Save() {
    var path = get("#ICON-PATH").value;
    if(strweight(path)) {
        page.icon = path;
    }
    showcontent(null);
}
function OpenIconSettings() {
    clear_settings();
    var innerhtml = '<div class="content">';
    innerhtml += '<h1 class="mini-header middle" style="margin-top:15px;">Иконка сайта</h1>';
    innerhtml += '<h1 class="mini-header">Путь</h1>';
    innerhtml += '<input type="text" class="inputfield" id="ICON-PATH">';
    innerhtml += '<input type="button" class="button" value="Готово" onclick="IconSettings_Save()">';
    innerhtml += '<input type="button" class="button" value="Отмена" style="margin-top:10px;margin-bottom:15px;" onclick="showcontent(null)">';
    innerhtml += '</div>';
    showcontent(null,content_str=innerhtml,width="400",height="300");
    get("#ICON-PATH").value = page.icon;
}

alert($(document).width());
ActivateWindowsAnimations();
light(true);
