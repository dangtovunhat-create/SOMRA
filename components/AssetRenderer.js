import React from 'react';
import { Text, Image } from 'react-native';
import { getAsset } from '../assets/index';
export default function AssetRenderer({ assetKey, size = 32, style }) {
  const asset = getAsset(assetKey);

  if (asset.type === 'emoji') {
    return (
      <Text style={[{ fontSize: size, textAlign: 'center' }, style]}>
        {asset.value}
      </Text>
    );
  }
  if (asset.type === 'image') {
    return (
      <Image
        source={{ uri: asset.uri }}
        style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      />
    );
  }
  if (asset.type === 'require') {
    return (
      <Image
        source={asset.src}
        style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      />
    );
  }

  return null;
}