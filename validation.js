/**
 * // form field attribute Information //
 * data-value-title = 한글명
 * data-value-type = valid 타입 체크 input type 속성 보다 우선순위 없는 경우 type 속성 적용 * 입력 이벤트 조정
 * data-value-pattern = form 어트리뷰트 체크 필요 속성 상수 VALIDPATTERN 패턴 참조 미등록시 data-value-type 적용
 * data-not-null = Not Null 허용 가능
 * data-max-length = 최대 길이(radio, checkbox 대응 속성으로 input 사용 시 maxlength, minlength 속성 강제 적용) * data-value-pattern 길이 우선
 * data-min-length = 최소 길이(radio, checkbox 대응 속성으로 input 사용 시 maxlength, minlength 속성 강제 적용) * data-value-pattern 길이 우선
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        let formatted = this;
        for (let arg in arguments) {
            formatted = formatted.replace("{?}", arguments[arg]);
        }
        return formatted;
    }
}

let defaultPattern = {
    id	: ["^[a-zA-Z]+[a-zA-Z0-9_-]{5,30}$","영문시작(영문+숫자+기호['-','_'])형식의 {?}~{?}자리", [6, 30]],
    pwd : ["^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[*.!@$%^&(){}:<>,?/~_+-=|])[A-Za-z\\d*.!@$%^&(){}:<>,?/~_+-=|]{{?},{?}}$","하나 이상의 대소문자 영문,숫자,기호 조합 형식의 {?}~{?}자리", [8, 30]],
    email	: ["^[0-9a-zA-Z_-]{1,}[.]{0,1}[0-9a-zA-Z_-]{1,}[@][0-9a-zA-Z_-]{1,}[.][\/.0-9a-zA-Z_-]{1,}[0-9a-zA-Z_-]{1,}$","0000@000.com"],
    tel : ["^0\\d{1,3}[-]{1}\\d{3,4}[-]{1}\\d{4}$","000-0000-0000", [0, 13]],
    hp : ["^01[016789][-]{1}\\d{3,4}[-]{1}\\d{4}$","000-0000-0000", [0, 13]],
    str : ["",""],
    radio : ["",""],
    checkbox : ["",""],
    file : ["",""],
    select : ["",""],
    alpha : ["^[A-Za-z]{1,}$","A~z 알파벳만 입력가능"],
    alphanum : ["^[\w|!@#$%^&*\(\)\?\<\>\[\]\{\}\_\-\:\,\.\/.0-9a-zA-Z_-]{0,}(\b.*\b|){0,}$","영문과 숫자만 입력"],
    estr : ["^[\w|!@#$%^&*\(\)\?\<\>\[\]\{\}\_\-\:\,\.\/.0-9a-zA-Z_-]{0,}(\b.*\b|){0,}$","영문,숫자,특수문자"],
    kstr : ["^[가-힣]*$","한글"],
    number : ["^\d{1,}$","0~9 숫자만 입력가능"],
    url : ["^[http:\/\/][.a-zA-Z0-9-]+.[a-zA-Z]+$","도메인"],
    ip : ["^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$","아이피"],
    date : ["^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$","0000-00-00"],
    mdate : ["",""],
    post : ["^[0-9]{3}[-]{1}[0-9]{3}$",""]
}

const EVENTKEYPATTERN = {
    id:/[^a-zA-Z0-9_-]/gi,
    pwd:/[^a-zA-Z0-9*.!@$%^&(){}:<>,?/~_+-=|]/gi,
    alpha:/[^a-zA-Z]/,
    alphanum:/[^a-zA-Z0-9]/gi,
    tel:/[^\-0-9]/gi,
    email:/^0-9a-zA-Z_-/gi,
    number:/[^0-9]/gi,
    ip:/[^\.0-9]/gi,
    url:/[^\/\.\_\-:a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅗ]/gi
}

class validation {
    _form;
    _fields;
    _valPattern;
    _submitAction;
    _faildAction;
    /**
     * @class
     * @Param{document.form} form
     * @Param{form.fields} fields
     * @Param{Object} option = [[/pattern/, description, [minlength,maxlength]]]
     * @author dev-truly
     * @since 2021.11.18
     */
    constructor(form, fields, option = {}) {
        this._form = form;
        this._fields = fields;
        this._valPattern = Object.assign(this.setPattern(defaultPattern), this.setPattern(option));
        this._submitAction = function() {
            this._form.submit();
        };
        this._faildAction  = function(msg = '') { alert(msg); };

        this._fields = this._fields.reduce((result, fieldName) => {
            try {
                let obj = this._form.querySelector(`#${fieldName}`);
                if (obj === null) {
                    throw new Error(`'${fieldName}' 객체가 존재하지 않습니다.`);
                }

                if (obj.tagName === 'INPUT') this.setInputValid(obj);
                result.push(fieldName);
            }
            catch (e) {
                console.log(e);
            }

            return result;
        }, []);
        //console.log(this._fields);
        this.validationSubmit();
    }

    /**
     * @function
     * @param{function()} func
     */
    setSubmitAction(func) {
        this._submitAction = (func) ? func : this._submitAction;
    }

    /**
     * @function
     * @param{function(msg = '')} func
     */
    setFaildAction(func) {
        this._faildAction = (func) ? func : this._faildAction;
    }

    setPattern(pattern) {
        let VALIDPATTERN = {};
        for (const[key, value] of Object.entries(pattern)) {
            let setObj = [];
            if (value[2]) {
                setObj.push(new RegExp(value[0].format(...value[2])));
                setObj.push(value[1].format(...value[2]));
            }
            else {
                setObj.push(new RegExp(value[0]));
                setObj.push(value[1]);
            }
            setObj.push(value[2]);
            VALIDPATTERN[key] = setObj;
        }

        return VALIDPATTERN;
    }

    getPattern(key) {
        return this._valPattern[key];
    }

    setInputValid(field) {
        let inputType = this.valTypeCheck(field);
        let valPattern = (field.getAttribute('data-value-pattern')) ? field.getAttribute('data-value-pattern') : field.getAttribute('data-value-type');
        if (EVENTKEYPATTERN[inputType]) {
            field.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(EVENTKEYPATTERN[inputType], '');
            }, false);
        }

        if (this._valPattern[valPattern]) {
            let partternAttr = this._valPattern[valPattern];
            if (partternAttr[2]) {
                if (partternAttr[2][0] > 0) field.setAttribute('minlength', partternAttr[2][0]);
                if (partternAttr[2][1] > 0) field.setAttribute('maxlength', partternAttr[2][1]);
            }
        }
        else {
            if (field.getAttribute('data-min-length')) field.setAttribute('minlength', field.getAttribute('data-min-length'));
            if (field.getAttribute('data-max-length')) field.setAttribute('maxlength', field.getAttribute('data-max-length'))
        }
    }

    valTypeCheck(field) {
        return field.getAttribute('data-value-type') ? field.getAttribute('data-value-type') : field.getAttribute('type');
    }
    lengthCheck(field, tagType) {
        switch (tagType){
            case 'text':case 'password':case 'date':case 'email':case 'hidden':case 'month':case 'number':
            case 'textarea':case 'search':case 'time':case 'week':case 'datetime':
                field.value = field.value.trim();
                return field.value.length;
            case 'checkbox':case 'radio':
                let checkedCount = 0;
                let objArray = this._form[field.getAttribute('name')];
                let objCount = objArray.length;
                if (objCount > 1) {
                    for (let i = 0; i < objArray.length;i++) {
                        if (objArray[i].checked) checkedCount++;
                    }
                }
                else {
                    if (objArray.checked) checkedCount++;
                }

                return checkedCount;
        }

    }

    tagTypeCheck(field) {
        switch (field.tagName.toLowerCase()) {
            case 'input':
                return field.getAttribute('type').toLowerCase();
                break;
            default:
                return field.tagName.toLowerCase();
        }
    }

    getForm () {
        return this._form;
    }

    validationSubmit() {
        this._form.addEventListener('submit', (e) => {
            this._fields.some((field) => {
               const _field = document.querySelector(`${field}`);
            });
            // submit, html, a 및 데이터 전송등의 이벤트 취소
            e.preventDefault();

            let error = false;
            let msg = '';
            let valLength = 0;
            error = this._fields.some((field) => {
                let result = true;
                const selector = document.querySelector(`#${field}`);

                let valName = (selector.getAttribute('data-value-title')) ? selector.getAttribute('data-value-title') : selector.getAttribute('name');
                let valType = this.valTypeCheck(selector);
                let tagType = this.tagTypeCheck(selector);
                let minL = 0;
                let maxL = 0;
                if (selector.getAttribute('data-min-length') || selector.getAttribute('minlength'))
                    minL = (selector.getAttribute('data-min-length')) ? selector.getAttribute('data-min-length') : selector.getAttribute('minlength');
                if (selector.getAttribute('data-max-length') || selector.getAttribute('maxlength'))
                    maxL = (selector.getAttribute('data-max-length')) ? selector.getAttribute('data-max-length') : selector.getAttribute('maxlength');

                let valTypeMsg;
                switch (tagType) {
                    case 'text':case 'password':case 'date':case 'email':case 'hidden':case 'month':case 'number':
                    case 'textarea':case 'search':case 'time':case 'week':case 'datetime':
                        valTypeMsg = '입력';
                        break;
                    default:
                        valTypeMsg = '선택';
                }

                result = this.lengthCheck(selector, tagType);
                if (selector.getAttribute('data-not-null') == 'true' && !result) {
                    msg = `'${valName}'(은)는 필수 ${valTypeMsg} 사항 입니다.` ;
                    selector.focus();
                    return true;
                }
                else if ((minL && minL > result) || (maxL && maxL < result)) {
                    msg = `'${valName}'의 ${valTypeMsg} 제한은 {?}~{?} 가능합니다.`.format(minL, maxL);
                    selector.focus();
                    return true;
                }
                else if (this._valPattern[valType] && !this._valPattern[valType][0].test(selector.value)) {
                    msg = `'${valName}'(은)는 ${this._valPattern[valType][1]}`;
                    selector.focus();
                    return true;
                }


                return !result;
            });

            if (!error) {
                this._submitAction();
            } else {
                this._faildAction(msg);
            }
        })
    }
}

