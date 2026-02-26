import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8fafc;
`;

export const Content = styled.View`
  padding: 16px;
  gap: 12px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #475569;
`;

export const Card = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  gap: 8px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

export const CardSubtitle = styled.Text`
  font-size: 13px;
  color: #475569;
`;

export const ExportButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#94a3b8" : "#065f46")};
  border-radius: 10px;
  padding: 12px;
  align-items: center;
`;

export const ExportButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
`;
