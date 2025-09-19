import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Section = styled.View`
  margin-bottom: 25px;
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  elevation: 2;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #444;
`;

export const Item = styled.TouchableOpacity`
  padding: 12px 8px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const ItemText = styled.Text`
  font-size: 16px;
  color: #555;
`;

export const Logout = styled.TouchableOpacity`
  background-color: #e53935;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
`;

export const LogoutText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;
