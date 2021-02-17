let download_gadget = document.getElementById("download");
let floating_window_open = false;
let fw = document.getElementsByClassName("floating-window")[0];
let page = new Page();

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
    ddownload_gadget.href = "data:text/plain;charset=utf-8;filename=name," +encodeURIComponent(text);
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
    download(page.compilate(),page.fileName + ".html");
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
        innerHtml += '<div class="item"><img class="obj-icon" src="icons/ultra.png"><p>' +page.elements[a].id+'['+ page.elements[a].type+']</p><div class="obj-buttons"><input type="button" style="background-image:url(' +"'"+"icons/arrow.png" + "'"+ ');transform:rotate(-90deg);" onclick="UpperObj(' + a +')"><input type="button" style="background-image:url(' +"'"+"icons/arrow.png" + "'"+ ');transform:rotate(90deg);" onclick="LowerObj(' + a +')"><input type="button" style="background-image:url(' +"'" + 'icons/info.png'+ "'"+')" onclick="OpenObjSettings(' +a +')" class="obj-button"><input type="button" style="background-image:url(' +"'" + 'icons/delete.png'+ "'"+')" class="obj-button" onclick="DeleteObj('+a+')"></div></div>';
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

function showcontent(content,content_str=null,width=-1,height=-1) {
    if(floating_window_open) {
        light(true);
        if(fw.classList.contains("disappear")) fw.classList.remove("disappear");
        if(fw.classList.contains("appear")) fw.classList.remove("appear");
        fw.classList.add("disappear");
        floating_window_open = false;
    }
    else {
        DeleteChildren(fw);
        if(width!=-1)
            fw.style.maxWidth = width + "px";
        else 
            fw.style.maxWidth = "800px";
        if(height!=-1)
            fw.style.maxHeight=height+"px";
        else
            fw.style.maxHeight="550px";
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
    document.getElementById("save-settings").click();
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
    innerhtml +='<h1 class="section-header">Редактирование дизайна</h1>';
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
    innerhtml += '<input type="button" class="button" value="Готово" onclick="ObjSettingsClose()">';
    innerhtml += '<input type="button" style="margin-top:10px;" class="button last" value="Отмена" onclick="showcontent(null)">';
    innerhtml +='</div>';
    showcontent(null,content_str=innerhtml);
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
    view.srcdoc = page.compilate();
}

function BackgroundSettings() {
    clear_settings();
    var innerhtml = '<div class="flex-content">';
    innerhtml += '<h1 class="mini-header" style="font-size:50px;margin-bottom:0px">Задний фон</h1>';
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
    else if(page.background.type = "изображение") {
        b = get("#image_button");
    }
    else return;
    b.style.borderColor="green";
    b.style.borderWidth ="2px";
    b.style.fontWeight="bold";

}
function OpenColorSettings() {
    if(page.background.type!="цвет") {
        if(!AdvancedConfirm("Вы хотите поменять задний фон на сплошной цвет?")) return;
    }

}
function OpenGradientSettings() {
    if(page.background.type!="градиент") {
        if(!AdvancedConfirm("Вы хотите поменять задний фон на градиент?")) return;
    }


}
function OpenCenterGradientSettings() {
    if(page.background.type!="центральный градиент") {
        if(!AdvancedConfirm("Вы хотите поменять задний фон на центральный градиент?")) return;
    }


}
function OpenImageSettings() {
    if(page.background.type!="изображение") {
        if(!AdvancedConfirm("Вы хотите поменять задний фон на изображение?")) return;
    }

}

function GetSelectedSlot() {
    let slot = localStorage.getItem("selected-slot");
    if(slot == null) {
        AdvancedAlert("Слот не выбран!");
    }
    else {
        page = JSON.parse(localStorage.getItem("slot-" + slot));
        alert(page);
    }
}

function SaveSlot() {
    if(slot == null ) return;
    localStorage.setItem("slot-" + slot,JSON.stringify(page,function(key, value) {
        if (typeof value === 'function') {
          return value.toString();
        } else {
          return value;
        }
      }));
    AdvancedAlert("Сохранено!");
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

//GetSelectedSlot();
ActivateWindowsAnimations();

UpdateAll();
Enable("elements");
light(true);
UpdateObjList();
