import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native';


const { width, height } = Dimensions.get('window');
const scalenFont = (size: number): number => size * PixelRatio.getFontScale();

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.05, // 5% largura da tela
        paddingVertical: height * 0.02, // 2% altura da tela
    },
    label: {
        marginBottom: height * 0.01, // 1% altura da tela
        fontSize: scalenFont(16),
    },
    input: {
        height: height * 0.06, // 6% altura da tela
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: height * 0.015, // 1,5% altura da tela
        paddingHorizontal: width * 0.02, // 2% largura da tela
        borderRadius: 6,
        backgroundColor: Platform.OS === 'ios' ? '#f8f8f8' : '#fff',
    },
});