import React from 'react';
import { Modal } from 'react-native';
import { 
     CenteredView,
     ModalView,
     ModalText,
     ButtonModal,
     ButtonTextModal,
} from './styles';

interface ModalSuccessProps {
    visible: boolean;
    message: string;
    onClose: () => void;
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <CenteredView>
                <ModalView>
                    <ModalText>{message}</ModalText>
                    <ButtonModal
                        onPress={onClose}
                    >
                        <ButtonTextModal>OK</ButtonTextModal>
                    </ButtonModal>
                </ModalView>
            </CenteredView>
        </Modal>
    );
};


export default ModalSuccess;
