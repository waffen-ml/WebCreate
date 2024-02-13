function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function ConvertNewLinesToBr(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}
class Page {
    constructor() {
        this.elements = [];
        this.info_collection = new InformationCollection();
        this.background = new background();
        this.icon = "";
        this.elementTypes = ['кнопка','строка','заголовок','текст','текстовое поле','изображение','галочка','связь радиокнопок','список','ссылка'];
        this.classicParameters = [
            new ClassicParameters("кнопка",[
                new Parameter("содержимое","Кнопка"),
                new Parameter("функция","")
            ]),
            new ClassicParameters("текст",[
                new Parameter("текст","Всем привет!"),
                new Parameter("максимальная ширина","300"),
                new Parameter("шрифт","25")
            ]),
            new ClassicParameters("заголовок",[
                new Parameter("текст","*Заголовок*")
            ]),
            new ClassicParameters("текстовое поле",[
                new Parameter("текст","текстовое поле"),
                new Parameter("ширина","250"),
                new Parameter("высота","100"),
                new Parameter("масштабируемое",false),
                new Parameter("сбор информации",false),
                new Parameter("обязательное заполнение",true)
            ]),
            new ClassicParameters("изображение",[
                new Parameter("путь",""),
                new Parameter("ширина","300"),
                new Parameter("высота","300"),
                new Parameter("разрешить присоединение",true),
                new Parameter("родные размеры",false),
                new Parameter("пропорциональное увеличение шириной",false)
            ]),
            new ClassicParameters("строка",[
                new Parameter("изначальное значение",""),
                new Parameter("подсказка",""),
                new Parameter("нижний текст",""),
                new Parameter("ширина","200"),
                new Parameter("сбор информации",false),
                new Parameter("обязательное заполнение",true)
            ]),
            new ClassicParameters("связь радиокнопок",[
                new Parameter("радиокнопки","Радиокнопка1\nРадиокнопка2"),
                new Parameter("заголовок","радиокнопки"),
                new Parameter("обводка",false),
                new Parameter("сбор информации",false),
                new Parameter("обязательное заполнение",true)
            ]),
            new ClassicParameters("галочка",[
                new Parameter("заголовок","галочка"),
                new Parameter("активность",false),
                new Parameter("сбор информации",false),
                new Parameter("обязательное заполнение",true)
            ]),
            new ClassicParameters("список",[
                new Parameter("оглавление","список"),
                new Parameter("пункты","Пункт1\nПункт2"),
                new Parameter("отступ элементов",true),
                new Parameter("нумерованность",false),
                new Parameter("выделенность оглавления",false)
            ]),
            new ClassicParameters("ссылка",[
                new Parameter("текст","Ссылка"),
                new Parameter("ссылка",""),
                new Parameter("в новом окне",false)
            ])
        ];
        this.classicDesign = [
            new ClassicDesign("кнопка",[
                new DesignAttribute("display","block"),
                new DesignAttribute("width","200px"),
                new DesignAttribute("height","45px"),
                new DesignAttribute("border","solid 1px black"),
                new DesignAttribute("background","white"),
                new DesignAttribute("font","normal 22px arial"),
                new DesignAttribute("outline","none"),
                new DesignAttribute("transition","filter 0.35s"),
                new DesignAttribute("cursor","pointer")
            ]),
            new ClassicDesign("текст",[
                new DesignAttribute("text-align","center")
            ]),
            new ClassicDesign("заголовок",[
                new DesignAttribute("text-align","center"),
                new DesignAttribute("font","bold 50px arial")
            ]),
            new ClassicDesign("галочка",[
                new DesignAttribute("font-family","arial"),
                new DesignAttribute("font-size","27px"),
                new DesignAttribute("align-self","center"),
                new DesignAttribute("display","flex")
            ]),
            new ClassicDesign("строка",[
                new DesignAttribute("display","block"),
                new DesignAttribute("width","200px"),
                new DesignAttribute("height","30px"),
                new DesignAttribute("border","solid 1px black"),
                new DesignAttribute("background","white"),
                new DesignAttribute("font","normal 22px arial"),
                new DesignAttribute("outline","none"),
                new DesignAttribute("transition","filter 0.35s")
            ]),
            new ClassicDesign("текстовое поле",[
                new DesignAttribute("display","block"),
                new DesignAttribute("width","200px"),
                new DesignAttribute("height","30px"),
                new DesignAttribute("border","solid 1px black"),
                new DesignAttribute("background","white"),
                new DesignAttribute("font","normal 22px arial"),
                new DesignAttribute("outline","none"),
                new DesignAttribute("transition","filter 0.35s"),
                new DesignAttribute("min-height","100px"),
                new DesignAttribute("min-width","200px"),
                new DesignAttribute("max-height","500px"),
                new DesignAttribute("max-width","500px")
            ]),
            new ClassicDesign("список",[
                new DesignAttribute("font","normal 21px arial")
            ]),
            new ClassicDesign("связь радиокнопок",[
                new DesignAttribute("font","normal 21px arial")
            ])
        ];
        this.fileName = "website";
        this.title = "Web Site";
        this.objectMargin = "20px";
        this.defaultBodyStyle="margin:0;";
        this.defaultContentStyle="position:relative;display: flex;align-items:center;flex-direction:column;";
    }

    getClassicParameters=function(type) {
        for(var a = 0; a < this.classicParameters.length;a+=1) {
            if(this.classicParameters[a].type == type) return copy(this.classicParameters[a].parameters);
        }
        return [];
    }

    getClassicDesign=function(type) {
        for(var a = 0; a < this.classicDesign.length;a+=1) {
            if(this.classicDesign[a].type == type) return copy(this.classicDesign[a].design);
        }
        return [];
    }

    addElement=function(element) {
        this.elements.push(element);
    }
    
    compilate=function(editor = false) {
        var output = "";
        var favicon = ""; if(strweight(this.icon)) favicon = '<link rel="icon" href="' +this.icon +'">';
        var mailscript = "";if(this.info_collection.enabled) mailscript = '<script src= "https://smtpjs.com/v3/smtp.js"></script> ';
        var collectInfoScript = "";
        var collectInfoButtonExists = false;
        if(this.info_collection.enabled && !editor) {
            var collect_info_elements = [];
            var collect_types = [];
            var necessarily_filled = [];
            for(var a=0; a < page.elements.length;a+=1) {
                if(page.elements[a].getValue("сбор информации") == true) {
                    collect_info_elements.push(page.elements[a].id);
                    collect_types.push(page.elements[a].type);
                    if(page.elements[a].getValue("обязательное заполнение")) necessarily_filled.push(true);
                    else necessarily_filled.push(false);
                }
            }
            collectInfoScript = 'if(formSended) {    alert("Невозможно отправить форму повторно.");}else {var output = "Информация с сайта '+this.title +':~";var collect_info_elements = ' +JSON.stringify(collect_info_elements) +';var collect_types = ' + JSON.stringify(collect_types) +';var necessarily_filled = ' +JSON.stringify(necessarily_filled) +';var error = false;function strweight(str) {    for(var a = 0; a < str.length;a+=1) {        if(str[a] != " " && str[a] != "\\n" && str[a] != "") return true;    }    return false;}function Error() {    error = true;    alert("Некоторые поля заполнены неправильно...");}for(var a = 0; a < collect_info_elements.length;a+=1) {    var element = document.getElementById(collect_info_elements[a]);    var information = "НЕИЗВЕСТНО";    if (collect_types[a] == "строка") {	information = element.value;    	if(!strweight(information) && necessarily_filled[a]) {	    Error();	    break;	}    }    else if(collect_types[a] == "галочка") {	if(element.checked) information = "Да";	else information = "Нет";    }    else if(collect_types[a] == "текстовое поле") {	information=element.value.replace(/(?:\\r\\n|\\r|\\n)/g, "<br>| ");	if(!strweight(element.value) && necessarily_filled[a]) {	    Error();	    break;	}    }    else if(collect_types[a] == "связь радиокнопок") {	information = element.children[0].innerHTML + "~| ";	var checked = "";	for(var b = 1; b < element.children.length;b+=1) {	    if(element.children[b].children[0].checked) {		checked = element.children[b].innerText;		break;	    }	}	if(checked == "") {	    if(necessarily_filled[a]) {		Error();		break;	    }	    information += "/Ничего не отмечено/";	}	else {	    information += "•" + checked;	}    }    output += "-------------------~";    output += "| " +collect_info_elements[a] + " (" + collect_types[a] + "):~| " +information + "~";}if(!error) {Email.send({     Host: "smtp.yandex.ru",     Username: "mrkostinilya@yandex.ru",     Password: "Fuck you!",     To: "'+page.info_collection.email+'",     From: "mrkostinilya@yandex.ru",     Subject: "WebCreate - Отчёт о данных",     Body: output.replace(/~/g,"<br>"),    })     .then(function (message) {       alert("Введённые данные успешно отправлены!");}); formSended = true;}}';
        }
        output += '<!DOCTYPE html><html><head>' + favicon+mailscript +'<meta name="viewport" content="width=device-width, initial-scale=1.0"><meta charset="UTF-8"><title>' + this.title + '</title><style>';
        output += "body{margin:0;}";
        output += ".background{" +this.background.get()+ "}"
        output += ".content{" + this.defaultContentStyle +"}";
        output += "input[type='button']:hover {filter:brightness(77%);}";
        output += '</style></head><body><div class="background"></div><div class="content">';
        for(var a = 0; a < page.elements.length;a+=1) {
            var design =page.elements[a].getWholeDesign();
            var getv = function(what){return page.elements[a].getValue(what);};
            var getd = function(what){return page.elements[a].getDesignParameter(what);};
            design += "margin-top:" + page.elements[a].margin + ";margin-bottom:0;";
            if(page.elements[a].type == "кнопка") {
                var onclick = page.elements[a].getValue("функция").replace(/(?:\r\n|\r|\n)/g," ");
                if(page.info_collection.enabled && page.elements[a].id.toLowerCase() == "отправить" && !collectInfoButtonExists) {
                    output += '<input id="' +page.elements[a].id +'" onclick="'+ collectInfoScript.replace(/"/g,"'") +onclick.replace(/"/g,"'") +'" type="button" style="' +design + '" value="' +page.elements[a].getValue("содержимое") + '">';
                    collectInfoButtonExists = true;
                }
                else
                    output += '<input id="' +page.elements[a].id +'" onclick="' +onclick.replace(/"/g,"'")+ '" type="button" style="' +design + '" value="' +page.elements[a].getValue("содержимое") + '">';
            }
            else if(page.elements[a].type == "текст") {
                design += "max-width:" + page.elements[a].getValue("максимальная ширина") + "px;";
                design += "font-size:" + page.elements[a].getValue("шрифт") + "px;";
                output += '<p id="' +page.elements[a].id +'" style="' +design + '">' + ConvertNewLinesToBr(page.elements[a].getValue("текст")) + '</p>';
            }
            else if(page.elements[a].type == "заголовок") {
                output += '<h1 id="' +page.elements[a].id +'" style="' +design+ '">' + ConvertNewLinesToBr(page.elements[a].getValue("текст"))+ '</h1>';
            }
            else if(page.elements[a].type == "изображение") {
                if(page.elements[a].getValue("родные размеры") == false) {
                    design += "width:" + page.elements[a].getValue("ширина") + "px;";
                    if(!page.elements[a].getValue("пропорциональное увеличение шириной"))design += "height:" + page.elements[a].getValue("высота") + "px;";
                }
                output +='<img id="' +page.elements[a].id +'" style="' + design+'"src="'+page.elements[a].getValue("путь")+ '">';
            }
            else if(page.elements[a].type == "связь радиокнопок") {
                var lines = page.elements[a].getValue("радиокнопки").split("\n");
                if(lines.length == 0) continue;
                if(page.elements[a].getValue("обводка") == true) {
                    design+="border:solid 1px black;padding:5px 8px;";
                }
                output+='<div id="' +page.elements[a].id +'" style="' +design +'">';
                output +='<p style="margin:0;">'+page.elements[a].getValue("заголовок")+'</p>';
                for(var b = 0; b< lines.length;b+=1) {
                    if(!strweight(lines[b]))continue;
                    output += '<p id="' +page.elements[a].id +"-"+ b +'" style="margin-bottom:0;margin-top:5px;"><input type="radio" style="margin:0;margin-right:5px" name="' +page.elements[a].id +'" value="'+lines[b]+'">' +lines[b] +'</p>';
                }
                output+="</div>";
            }
            else if(page.elements[a].type == "галочка") {
                var checked = ""; if(page.elements[a].getValue("активность")) checked="checked";
                var fontsize = page.elements[a].getDesignParameter("font-size");
                var checkbox_design='margin-right:4px;align-self:center;';
                if(fontsize!=null) {
                    checkbox_design +='width:'+fontsize+';height:' +fontsize + ';';
                }
                output += '<p style="'+design+'"><input style="'+checkbox_design+'" type="checkbox" id="' + page.elements[a].id+'" ' +checked +'>' +page.elements[a].getValue("заголовок") +'</p>';
            }
            else if(page.elements[a].type =="строка") {
                output += '<input id="' +page.elements[a].id +'" type="text" style="' +design+ '" value="' +page.elements[a].getValue("изначальное значение")+ '" placeholder="' +page.elements[a].getValue("подсказка")+ '">';
                var tip = page.elements[a].getValue("нижний текст");
                if(strweight(tip)) {
                    output += '<p style="margin-top:2px;font:normal 16px arial;">' +tip+ '</p>';
                }
            }
            else if(page.elements[a].type == "текстовое поле") {
                if(page.elements[a].getValue("масштабируемое") == false) design+="resize:none;";
                var width = getv("ширина") + "px";
                var height = getv("высота") + "px";
                design += "width:" + width+";";
                design += "height:" + height + ";";
                output += '<textarea id="' +page.elements[a].id +'" style="'+design+'">'+page.elements[a].getValue("текст") +'</textarea>';
            }
            else if(page.elements[a].type == "список") {
                var numberize = getv("нумерованность");
                var el_margin = getv("отступ элементов");
                var el_margin_coeff= ""; if(el_margin) el_margin_coeff = "margin-left:1.2em;";
                var bold_header_coeff = ""; if(getv("выделенность оглавления")) bold_header_coeff="font-weight:bold;";
                var type = "ul";if(numberize) type="ol";
                var puncts = getv("пункты").split("\n");
                output += '<' +type +' style="' +design +'" id="' +page.elements[a].id +'">';
                output += '<p style="margin-top:0;margin-bottom:5px;' +bold_header_coeff +'">' +getv("оглавление")+ '</p>';
                for(var i = 0; i < puncts.length;i+=1) {
                    output += '<li style="margin-bottom:2px;' +el_margin_coeff+ '">' + puncts[i]+'</li>';
                }
                output += "</" + type+ ">";
            }
            else if(page.elements[a].type=="ссылка") {
                var in_new_window_coeff = ""; if(getv("в новом окне")) in_new_window_coeff='target="_blank"';
                output += '<a id="' +page.elements[a].id +'" href="' +getv("ссылка")+ '" style="' + design+'" ' + in_new_window_coeff+ '>' + getv("текст")+ '</a>';
            }
        }
        if(page.info_collection.enabled && !collectInfoButtonExists) {
            output += '<input onclick="'+ collectInfoScript.replace(/"/g,"'") +'" type="button" style="border:solid 1px black;outline:none;font:normal 23px arial;backround:white;transition:filter 0.4s;width:145px;cursor:pointer;margin-top:35px;box-shadow:0px 0px 3px 0px black;" value="Отправить">';
        }
        output += '</div>';
        if(page.info_collection.enabled && !editor) {
            output += "<script>let formSended = false;</script>";
        }
        output += '</body></html>';
        return output;  
    }

}

class Element {
    constructor(type,id) {
        this.id = id;
        this.type = type;
        this.parameters = page.getClassicParameters(this.type);
        this.design = page.getClassicDesign(this.type);
        this.margin = page.objectMargin;
    }

    hasDesignParameter=function(name) {
        for(var a = 0; a < this.design.length;a+=1) {
            if(this.design[a].name == name) return true;
        }
        return false;
    }

    setValue=function(name,value) {
        for(var a = 0; a < this.parameters.length;a+=1) {
            if(this.parameters[a].name == name) {
                this.parameters[a].value = value;
                return;
            }
        }
    }

    getValue=function(name) {
        for(var a = 0; a < this.parameters.length;a+=1) {
            if(this.parameters[a].name == name) return this.parameters[a].value;
        }
        return null;
    } 

    getWholeDesign=function() {
        var output = "";
        for(var a = 0; a < this.design.length;a+=1) {
            output += this.design[a].name + ":" + this.design[a].value + ";";
        }
        return output;
    }

    getDesignParameter = function(name) {
        for(var a = 0; a < this.design.length;a++) {
            if(this.design[a].name == name) return this.design[a].value;
        }
        return null;
    }

}

class InformationCollection {
    constructor() {
        this.email = "";
        this.enabled = false;
    }
}

class background {
    constructor() {
        this.type = "цвет";
        this.color = new Color(255,255,255);
        this.direction = "to right";
        this.gradientFrom = new Color(255,255,255);
        this.gradientTo = new Color(255,255,255);
        this.imgPath = "";
        this.whitefilter = false;
    }
    get = function() {
        if(this.type == "цвет")
            return 'position:fixed;width:100%;height:100%;background-color:' + this.color.get() + ";";
        else if(this.type == "градиент")
            return 'position:fixed;width:100%;height:100%;background-repeat:no-repeat;background-image:linear-gradient(' + this.direction + "," + this.gradientFrom.get() + "," + this.gradientTo.get() + ");";
        else if(this.type == "центральный градиент")
            return 'position:fixed;width:100%;height:100%;background-repeat:no-repeat;background-image:radial-gradient(' + this.gradientFrom.get() + "," + this.gradientTo.get() + ");";
        else if(this.type == "изображение") {
            var output ='position:fixed;background-position: center;background-attachment: fixed;background-size:cover;width:100%;height:100%;background-repeat:no-repeat;background-image:url("' + this.imgPath+'");';
            if(this.whitefilter) output += 'filter:invert(25%) brightness(150%);';
            return output;
        }
    }

}

class Color {
    constructor(r,g,b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    get = function() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
}

class ClassicParameters {
    constructor(type,params) {
        this.parameters = params;
        this.type=type;
    }
}

class ClassicDesign {
    constructor(type,design) {
        this.type = type;
        this.design = design;
    }
}

class DesignAttribute {
    constructor(name,value) {
        this.name = name;
        this.value = value;
    }
}

class Parameter {
    constructor(name,value) {
        this.name = name;
        this.value = value;
    }
    setVal=function(value) {
        this.value = value;
    }
}

class Project {
    constructor() {
        this.appointment = "статья";
        this.name = "Проект";
        this.slot = "1";
    }
    download = function() {
        try {
            var name_buff = this.name.split();
            var forbidden = ['/','\\','<','>','?',':','"','*','|'];
            for(var a = 0; a < name_buff.length;a+=1) {
                if(forbidden.includes(name_buff[a])) {
                    forbidden[a] = '-';
                }
            }
            var legal_name = name_buff.join("");
            var json = localStorage.getItem("slot" + this.slot);
            if(json == null) throw 'Error with storage';
            download(json,legal_name + ".webc");
        }catch {
            AdvancedAlert("Что-то пошло не так...");
        }
    }
}

class Projects {
    constructor() {
        this.projects = [];
    }
    load = function() {
        var info = localStorage.getItem("projects");
        if(info == null) return;
        else 
            this.projects = AdvancedJSONparse(info);
    }
    save = function() {
        localStorage.setItem("projects", AdvancedJSONstringify(this.projects));
    }
}
