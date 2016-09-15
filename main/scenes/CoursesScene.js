/**
 * @flow
 */

import React, {Component, PropTypes} from 'react'
import {StyleSheet, ListView, Text, View, Image, TouchableHighlight} from 'react-native'
import Colors from '../commons/colors'

const urlArray = [
  'http://movietrailers.apple.com/movies/independent/snowden/snowden-tlr3_i320.m4v',
  'http://movietrailers.apple.com/movies/weinstein/gold/gold-trailer-1_i320.m4v'
]

export default class CoursesScene extends Component {

  static propTypes = {
      category: PropTypes.object.isRequired,
      selectCourse: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      dataSource: ds.cloneWithRows(this.props.category.courses)
    }

    this._renderRow = this._renderRow.bind(this)
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight style={styles.row}
                          activeOpacity={1.0}
                          onPress={() => this.props.selectCourse(rowData)}>
        <View style={styles.rowImage}>
          <Image source={{uri: 'http://lorempixel.com/300/120/cats/' + (parseInt(rowID))}} style={styles.rowImage} />
          <Text style={styles.text}>
            {rowData.title.toUpperCase()}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  render () {
    return (
            <ListView
              dataSource={this.state.dataSource}
              style={styles.list}
              renderRow={this._renderRow}
            />
        )
  }
}

const styles = StyleSheet.create({
  rowImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.9
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textAlignVertical: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    height: 100,
    overflow: 'hidden'

  },
  list: {
    backgroundColor: '#FFF'
  }
})
