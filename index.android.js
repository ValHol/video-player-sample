/**
 * Sample React Native App
 * @flow
 */

import React, {Component} from 'react'
import {AppRegistry, StyleSheet, Navigator, BackAndroid, View, Image} from 'react-native'
import CategoriesScene from './main/scenes/CategoriesScene'
import CoursesScene from './main/scenes/CoursesScene'
import VideoScene from './main/scenes/VideoScene'

const categories = require('./main/mock/mock.json')

class VideoPlayerSample extends Component {

  constructor (props) {
    super(props)
    this.routes = [
      {
        title: 'Categories',
        index: 0
      },
      {
        title: 'Courses',
        index: 1
      },
      {
        title: 'Video',
        index: 2
      }
    ]

    this.state = {
      currentScene: this.routes[0]
    }

    this.mainNavigator = {}

    BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.state.currentScene.index !== this.routes[0].index) {
          this.mainNavigator.pop()
          return true
        }
        return false
      }
    )
    BackAndroid.addEventListener.bind(this)
  }

  render () {
    return (
            <Navigator
              initialRoute={this.routes[0]}
              renderScene={(route, navigator) => {
                this.state.currentScene = route
                this.mainNavigator = navigator

                switch (route.index) {
                  case 2:
                    return (
                      <VideoScene
                        navigation={navigator}
                        course={route.course} />
                    )
                  case 1:
                    return (
                      <CoursesScene
                        navigation={navigator}
                        courseList={categories[route.rowid].courses}
                        categoryTitle={categories[route.rowid].title} />
                    )
                  case 0:
                  default:
                    return (
                      <CategoriesScene
                        navigation={navigator}
                        dataSource={categories} />
                    )
                }
               }
              }
            />
        )
  }
}

AppRegistry.registerComponent('VideoPlayerSample', () => VideoPlayerSample)
