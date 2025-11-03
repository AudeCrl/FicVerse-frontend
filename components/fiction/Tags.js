import React from 'react';
import { View } from 'react-native';
import Tag from './Tag';

export default function Tags({ tags, withCross }) {

    return (
        <View 
            style={{
                flexDirection: 'row',
                alignItems: 'top',
                flexWrap: 'wrap',
            }}>
                {tags.map((tag, index) => 
                    <Tag key={index} label={tag.name} colorIndex={tag.color}  withCross={withCross} />)}
        </View>
    );
}