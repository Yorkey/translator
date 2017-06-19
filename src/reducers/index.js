/**
 * Created by wangyu on 2017/5/29.
 */
import { combineReducers } from "redux";
import actions from "../actions/index";
import UpdateCurrencyAction from "../actions/UpdateCurrencyAction";

export const translateTypeList = {
    currency: ["CNY", "USD", "HKD", "JPY", "EUR", "GBP", "THB", "KRW", "CAD", "IDR", "SGD", "AUD"],
    len: ["KM", "M", "DM", "CM", "MM", "LI", "ZH", "CHI", "CUN", "FEN", "NMI", "MI", "IN", "YD"],
};

let defaultTranslateMap = {
    currency: {
        CNY: {name: '人民币', icon: require('../assets/country-icon/CNY.png'), key: 'CNY', rate: 1.0, value: ""},
        USD: {name: '美元', icon: require('../assets/country-icon/USD.png'), key: 'USD', rate: 1.0, value: ""},
        HKD: {name: '港元', icon: require('../assets/country-icon/HKD.png'), key: 'HKD', rate: 1.0, value: ""},
        JPY: {name: '日元', icon: require('../assets/country-icon/JPY.png'), key: 'JPY', rate: 1.0, value: ""},
        EUR: {name: '欧元', icon: require('../assets/country-icon/EUR.png'), key: 'EUR', rate: 1.0, value: ""},
        GBP: {name: '英镑', icon: require('../assets/country-icon/GBP.png'), key: 'GBP', rate: 1.0, value: ""},
        THB: {name: '泰铢', icon: require('../assets/country-icon/THB.png'), key: 'THB', rate: 1.0, value: ""},
        KRW: {name: '韩元', icon: require('../assets/country-icon/KRW.png'), key: 'KRW', rate: 1.0, value: ""},
        CAD: {name: '加元', icon: require('../assets/country-icon/CAD.png'), key: 'CAD', rate: 1.0, value: ""},
        IDR: {name: '印尼盾', icon: require('../assets/country-icon/IDR.png'), key: 'IDR', rate: 1.0, value: ""},
        SGD: {name: '新加坡元', icon: require('../assets/country-icon/SGD.png'), key: 'SGD', rate: 1.0, value: ""},
        AUD: {name: '澳元', icon: require('../assets/country-icon/AUD.png'), key: 'AUD', rate: 1.0, value: ""},
    },
    len: {
        KM: {name: '千米', textIcon: 'km', key: 'KM', rate: 0.001, value: ""},
        M: {name: '米', textIcon: 'm', key: 'M', rate: 1.0, value: ""},
        DM: {name: '分米', textIcon: 'dm', key: 'DM', rate: 10, value: ""},
        CM: {name: '厘米', textIcon: 'cm', key: 'CM', rate: 100, value: ""},
        MM: {name: '毫米', textIcon: 'mm', key: 'MM', rate: 1000, value: ""},
        LI: {name: '里', textIcon: 'li', key: 'LI', rate: 0.002, value: ""},
        ZH: {name: '丈', textIcon: 'zh', key: 'ZH', rate: 0.3, value: ""},
        CHI: {name: '尺', textIcon: 'chi', key: 'CHI', rate: 3.0, value: ""},
        CUN: {name: '寸', textIcon: 'cun', key: 'CUN', rate: 30.0, value: ""},
        FEN: {name: '分', textIcon: 'fen', key: 'FEN', rate: 300, value: ""},
        NMI: {name: '海里', textIcon: 'nmi', key: 'NMI', rate: 0.00054, value: ""},
        MI: {name: '英里', textIcon: 'mi', key: 'MI', rate: 0.0006214, value: ""},
        IN: {name: '英寸', textIcon: 'in', key: 'IN', rate: 39.3700787, value: ""},
        YD: {name: '码', textIcon: 'yd', key: 'YD', rate: 1.0936133, value: ""},
    }
};

let highlightLine = (state = 0, action) => {
    switch (action.type){
        case actions.HIGHLIGHT_LINE:
            return action.data;
        default:
            return state;
    }
};

let highlightIcon = (state = -1, action) => {
    switch (action.type){
        case actions.HIGHLIGHT_ICON:
            return action.data;
        default:
            return state;
    }
};

let showCurrencyGuide = (state = true, action) => {
    switch (action.type){
        case actions.HIDE_CURRENCY_GUIDE:
            return false;
        default:
            return state;
    }
};

const defaultListInfo = {
    showType: "currency",
    showList: {
        currency: ["CNY", "USD", "HKD", "JPY"],
        len: ["M", "CHI", "MI", "IN"],
    },
};
let listInfo = (state = defaultListInfo, action) => {
    switch (action.type){
        case actions.CHANGE_SHOW_LIST:
            let newList = [...state.showList[state.showType]];
            newList[action.highlightLine] = action.newKey;
            state.showList = {...state.showList};
            state.showList[state.showType] = newList;
            return {...state};
        case actions.CHANGE_SHOW_TYPE:
            return {...state, showType: action.data};
        default:
            return state;
    }
};


const defaultTranslateMapInfo = {
    loadingQuote: false,
    loadQuoteError: null,
    updateTime: null,
    translateMap: defaultTranslateMap,
};
let translateListInfo = (state = defaultTranslateMapInfo, action) => {
    let newTranslateMap;
    switch (action.type){
        case actions.TRANSLATE_VALUE:
            let newTranslate = {...state.translateMap[action.showType]};
            for (let key in newTranslate) {
                if (key === action.key) {
                    newTranslate[key].value = action.value;
                } else {
                    if (action.value === "") {
                        newTranslate[key].value = "";
                    } else if (Number(action.value) === 0) {
                        newTranslate[key].value = "0";
                    } else {
                        let newValue = Number(action.value)*newTranslate[key].rate/newTranslate[action.key].rate;
                        newTranslate[key].value = newValue.toFixed(3);
                    }
                }
            }
            newTranslateMap = {...state.translateMap};
            newTranslateMap[action.showType] = newTranslate;
            return {...state, translateMap: newTranslateMap};
        case UpdateCurrencyAction.START_UPDATE_QUOTE:
            return {...state, loadingQuote: true};
        case UpdateCurrencyAction.UPDATE_QUOTE_SUCCEED:
            let currencyMap = {...state.translateMap.currency};
            for (let key in currencyMap) {
                for (let quote of action.data) {
                    if (quote.resource.fields.name === "USD/"+key) {
                        currencyMap[key].rate = Number(quote.resource.fields.price);
                        break;
                    }
                }
            }
            newTranslateMap = {...state.translateMap, currency: currencyMap};
            return {...state, loadingQuote: false, loadQuoteError: null, updateTime: new Date().getTime(), translateMap: newTranslateMap};
        case UpdateCurrencyAction.UPDATE_QUOTE_FAILED:
            return {...state, loadingQuote: false, loadQuoteError: action.data};
        default:
            return state;
    }
};

export default combineReducers({
    highlightLine,
    highlightIcon,
    showCurrencyGuide,
    listInfo,
    translateListInfo,
});
