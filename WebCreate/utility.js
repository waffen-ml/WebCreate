function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function ConvertNewLinesToBr(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}
class Page {
    constructor() {
        this.elements = [];
        this.background = new background();
        this.icon = new Icon("","ico");
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
                new Parameter("масштабируемое",false)
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
                new Parameter("ширина","200")
            ]),
            new ClassicParameters("связь радиокнопок",[
                new Parameter("радиокнопки","Радиокнопка1\nРадиокнопка2"),
                new Parameter("заголовок","радиокнопки"),
                new Parameter("обводка",false)
            ]),
            new ClassicParameters("галочка",[
                new Parameter("заголовок","галочка"),
                new Parameter("активность",false)
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
            ])
        ];
        this.fileName = "website";
        this.title = "Web Site";
        this.objectMargin = 20;
        this.defaultBodyStyle="margin:0;";
        this.defaultContentStyle="display: flex;align-items:center;flex-direction:column;";
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
    
    compilate=function() {
        var output = "";
        var favicon = ""; if(strweight(this.icon.path)) favicon = '<link rel="icon" type="image/' +this.icon.format+ '" href="' +this.icon.path + "." + this.icon.format+ '">';
        output += '<!DOCTYPE html><html><head>' + favicon+'<meta charset="UTF-8"><title>' + this.title + '</title><style>';
        output += "body{}";
        output += "background{" +this.background.get()+ "}"
        output += ".content{" + this.defaultContentStyle +"}";
        output += "input[type='button']:hover {filter:brightness(77%);}";
        output += '</style></head><body><div class="content">';
        for(var a = 0; a < page.elements.length;a+=1) {
            var design =page.elements[a].getWholeDesign();
            var getv = function(what){return page.elements[a].getValue(what);};
            var getd = function(what){return page.elements[a].getDesignParameter(what);};
            if(!page.elements[a].hasDesignParameter("margin-top")) design += "margin-top:" + this.objectMargin + "px;";
            if(page.elements[a].type == "кнопка") {
                var onclick = page.elements[a].getValue("функция").replace(/(?:\r\n|\r|\n)/g," ");
                output += '<input onclick="' +onclick.replace(/"/g,"'")+ '" type="button" style="' +design + '" value="' +page.elements[a].getValue("содержимое") + '">';
            }
            else if(page.elements[a].type == "текст") {
                design += "max-width:" + page.elements[a].getValue("максимальная ширина") + "px;";
                design += "font-size:" + page.elements[a].getValue("шрифт") + "px;";
                design+="word-break:break-all;";
                output += '<p style="' +design + '">' + ConvertNewLinesToBr(page.elements[a].getValue("текст")) + '</p>';
            }
            else if(page.elements[a].type == "заголовок") {
                output += '<h1 style="' +design+ '">' + ConvertNewLinesToBr(page.elements[a].getValue("текст"))+ '</h1>';
            }
            else if(page.elements[a].type == "изображение") {
                if(page.elements[a].getValue("родные размеры") == false) {
                    design += "width:" + page.elements[a].getValue("ширина") + "px;";
                    if(!page.elements[a].getValue("пропорциональное увеличение шириной"))design += "height:" + page.elements[a].getValue("высота") + "px;";
                }
                output +='<img style="' + design+'"src="'+page.elements[a].getValue("путь")+ '">';
            }
            else if(page.elements[a].type == "связь радиокнопок") {
                var lines = page.elements[a].getValue("радиокнопки").split("\n");
                if(lines.length == 0) continue;
                if(page.elements[a].getValue("обводка") == true) {
                    design+="border:solid 1px black;padding:5px 8px;";
                }
                output+='<div style="' +design +'">';
                output +='<p style="margin:0;">'+page.elements[a].getValue("заголовок")+'</p>';
                for(var b = 0; b< lines.length;b+=1) {
                    if(!strweight(lines[b]))continue;
                    output += '<p style="margin-bottom:0;margin-top:5px;"><input type="radio" style="margin:0;margin-right:5px" name="' +page.elements[a].id +'" value="'+lines[b]+'">' +lines[b] +'</p>';
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
                output += '<input type="text" style="' +design+ '" value="' +page.elements[a].getValue("изначальное значение")+ '" placeholder="' +page.elements[a].getValue("подсказка")+ '">';
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
                output += '<textarea style="'+design+'">'+page.elements[a].getValue("текст") +'</textarea>';
            }
            else if(page.elements[a].type == "список") {
                var numberize = getv("нумерованность");
                var el_margin = getv("отступ элементов");
                var el_margin_coeff= ""; if(el_margin) el_margin_coeff = "margin-left:1.2em;";
                var bold_header_coeff = ""; if(getv("выделенность оглавления")) bold_header_coeff="font-weight:bold;";
                var type = "ul";if(numberize) type="ol";
                var puncts = getv("пункты").split("\n");
                output += '<' +type +' style="' +design +'">';
                output += '<p style="margin-top:0;margin-bottom:5px;' +bold_header_coeff +'">' +getv("оглавление")+ '</p>';
                for(var i = 0; i < puncts.length;i+=1) {
                    output += '<li style="margin-bottom:2px;' +el_margin_coeff+ '">' + puncts[i]+'</li>';
                }
                output += "</" + type+ ">";
            }
            else if(page.elements[a].type=="ссылка") {
                var in_new_window_coeff = ""; if(getv("в новом окне")) in_new_window_coeff='target="_blank"';
                output += '<a href="' +getv("ссылка")+ '" style="' + design+'" ' + in_new_window_coeff+ '>' + getv("текст")+ '</a>';
            }
        }
        output += '</div></body></html>';
        return output;  
    }

}

class Element {
    constructor(type,id) {
        this.id = id;
        this.type = type;
        this.parameters = page.getClassicParameters(this.type);
        this.design = page.getClassicDesign(this.type);
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

class background {
    constructor() {
        this.type = "цвет";
        this.color = "#ffffff";
        this.direction = "to right";
        this.gradientFrom = "#ffffff";
        this.gradientTo = "#ffffff";
        this.imgPath = "";
    }
    get = function() {
        if(this.type == "цвет")
            return 'position:fixed;width:100%;height:100%;background:' + this.color + ";";
        else if(this.type == "градиент")
            return 'position:fixed;width:100%;height:100%;background-repeat:no-repeat;background-image:linear-gradient(' + this.direction + "," + this.gradientFrom + "," + this.gradientTo + ");";
        else if(this.type == "центральный градиент")
            return 'position:fixed;width:100%;height:100%;background-repeat:no-repeat;background-image:radial-gradient(' + this.gradientFrom + "," + this.gradientTo + ");";
        else if(this.type == "изображение") 
            return 'position:fixed;background-position: center;background-attachment: fixed;background-size:cover;width:100%;height:100%;background-repeat:no-repeat;background-image:url("' + this.imgPath+'");';
    }

}

class Icon {
    constructor(path,format) {
        this.path = path;
        this.format = format;
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










/* Мертвая зона, не входить!!!
function _copyArray(array) {
    var newarray = [];
    for(var a = 0; a < array.length;a+=1) {
        newarray.push(array[a]);
    }
    return newarray;
}

class Page {
    constructor() {
        this.title = "WebSite";
        this.fileName = "WebSite";
        this.avaibleTypes = ['button','inputbox'];
        this.style = new Styles();
        this.elements = [];
        this.defaultParams = [new DefaultParams("button",[new Param("value","Кнопка")]),new DefaultParams("inputbox",[new Param("value","Кнопка")])];
    }
    addElement(element) {
        this.elements.push(Object.assign(Element,element));
    }

    removeElement(id) {
        for(var a = 0; a < this.elements.length;a+=1) {
            if(this.elements[a].id == id) {
                this.elements.splice(a,1);
                break;
            }
        }
    }

    getDefaultParams(type) {
        for(var a = 0; a < this.defaultParams.length;a+=1) {
            if(this.defaultParams[a].type == type) {

                return this.defaultParams[a].params;
            }
        }
        return [];
    }

    compilate() {
        var output = "";
        output += '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + this.title + '</title></head><body>';
        for(var a = 0; a < this.elements.length;a+=1) {
            if(this.elements[a].type == "button") {
                output += '<input type="button" style="' +page.style.getDefaultStyle(this.elements[a]) +  '" value="' +this.elements[a].getParam("value") + '">';
            }

        }
        output += '</body></html>';
        return output;  
    }

}

class Element {
    constructor(type) {
        this.type = type;
        this.functions = [];
        this.style = page.style.getDefaultStyle(this.type);
        this.id = "";
        this.initDefaultParams();
    }
    getParamId(name) {
        for(var a = 0; a < this.params.length;a+=1) {
            if(this.params[a].name == name) return a;
        }
        return -1;
    }

    setParam(name,value) {
        var id = this.getParamId(name);
        if(id==-1)return;
        this.params[id].value = value;
    }    
    
    _getAllParamNames() {
        var names = [];
        for(var a = 0; a < this.params.length;a+=1) {
            names.push(this.params[a].name);
        }
        return names;
    }

    getParam(name) {
        var id = this.getParamId(name);
        if(id==-1)return null;
        return this.params[id].value;
    }

    initDefaultParams() {
        this.params = page.getDefaultParams(this.type);
    }    

    addFunction(name,value) {
        this.functions.push(new Function(name,value));
    }
}

class Param {
    constructor(name,value) {
        this.name = name;
        this.value = value;
    }
}

class DefaultParams {
    constructor(defaulttype,paramlist) {
        this.params = paramlist;
        this.type = defaulttype
    }
    getParamId(name) {
        for(var a = 0; a < this.params.length;a+=1) {
            if(this.params[a].name == name) return a;
        }
        return -1;
    }
    getParam(name) {
        var id = this.getParamId(name);
        if(id == -1) return null;
        return this.params[id].value;
    }
}

class Function {
    constructor(name,value) {
        this.name = name;
        this.value = value;
    }
}
class Styles {
    constructor() {
        this.ButtonStyle="";
        this.ButtonHoverStyle="";
    }

    getDefaultStyle(type,hover=false) {
        if(type=="button" && !hover)return this.ButtonStyle;
        else if(type=="button" && hover) return this.ButtonHoverStyle;

    }
}
*/