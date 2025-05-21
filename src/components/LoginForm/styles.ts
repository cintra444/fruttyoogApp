import {  Dimensions, PixelRatio, Platform } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');
const scalenFont = (size: number): number => size * PixelRatio.getFontScale();

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    padding-horizontal: ${width * 0.05}px;
    padding-vertical: ${height * 0.02}px;
    `;

export const Label = styled.Text`
    font-size: ${scalenFont(16)}px;
    margin-bottom: ${height * 0.01}px;
    `;

export const Input = styled.TextInput`
    height: ${height * 0.06}px;
    border-color: #ccc;
    border-width: 1px;
    margin-bottom: ${height * 0.015}px;
    padding-horizontal: ${width * 0.02}px;
    border-radius: 6px;
    background-color: ${Platform.OS === 'ios' ? '#f8f8f8' : '#ffffff'};
    `;

export const Button = styled.TouchableOpacity`
    background-color: #007bff;
    padding-vertical: ${height * 0.015}px;
    border-radius: 6px;
    margin-vertical: ${height * 0.02}px;
    `;