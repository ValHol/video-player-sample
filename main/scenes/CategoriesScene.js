/**
 * @flow
 */

import React, {Component, PropTypes} from 'react'
import {StyleSheet, ListView, Text, TouchableHighlight, View, Image} from 'react-native'
import Colors from '../commons/colors'

export default class CategoriesScene extends Component {

  static propTypes = {
      dataSource: PropTypes.array.isRequired,
      selectCategory: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(this.props.dataSource)
    }
  }

  render () {
    return (
            <ListView
              style={styles.list}
              dataSource={this.state.dataSource}
              renderRow={(rowData, sectionID, rowID, highlightRow) =>
                    <TouchableHighlight style={styles.row}
                      activeOpacity={1.0}
                      onPress={() => this.props.selectCategory(rowData.title, rowID)}>
                        <View style={styles.rowImage}>
                            <Image source={{uri: 'http://lorempixel.com/300/120/abstract/' + (rowData.index + 3)}}
                                   style={styles.rowImage} />
                            <Text style={styles.text}>
                                {rowData.title.toUpperCase()}
                            </Text>
                        </View>
                    </TouchableHighlight>
                }
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
  container: {
    flex: 1,
    padding: 16
  },
  list: {},
  videoTitle: {
    fontSize: 16,
    textAlign: 'left'
  },
  videoBody: {
    fontSize: 14,
    textAlign: 'left'
  },
  video: {
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: Colors.DARK_RED
  }
})
