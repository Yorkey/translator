/**
 * Created by wangyu on 2016/7/29.
 */
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import App from './App';
import enhance from './mixin/Enhance';
//import SplashScreen from 'react-native-splash-screen';
let AppEnhance = enhance(App);

export default class Root extends Component {

    // 构造
    constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            isLoading: true,
            store: configureStore(() => {
                this.setState({
                    isLoading: false,
                }, () => {
					//SplashScreen.hide();//关闭启动屏幕
				});
            }),
        };
    }



    render() {
        if (this.state.isLoading) {
            return null;
        }
        return (
            <Provider store={this.state.store}>
                <AppEnhance />
            </Provider>
        );
    }
}