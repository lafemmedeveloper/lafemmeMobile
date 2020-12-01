import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import CardItemCart from '../../components/CardItemCart';

class Example extends Component {
  state = {
    data: this.props.list,
  };

  renderItem = ({item, index, drag, isActive}) => {
    const {removeItem, down, up} = this.props;
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? 'blue' : item.backgroundColor,
        }}
        onLongPress={drag}>
        <CardItemCart
          key={index}
          isCart={true}
          showExperts={false}
          data={item}
          removeItem={removeItem}
          index={index}
          down={down}
          up={up}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{height: '100%'}}>
        <DraggableFlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({data}) => this.setState({data})}
        />
      </View>
    );
  }
}

export default Example;
