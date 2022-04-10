import "../styles/Modals.scss";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import Axios from "axios";

const EditFunctionaryModal = (props) => {
    const [isMaster, setIsMaster] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonClassName, setButtonClassName] = useState("");
    const [hideNormalButton, setHideNormalButton] = useState(false);
    const [hideMasterButton, setHideMasterButton] = useState(false);

    const initialRenderDone = useRef(false);
    useEffect( async () => {
        if(!initialRenderDone.current) {
            initialRenderDone.current = true;
        }
        else {
            await updateFunctionary();
            props.onClose();
            setIsLoading(false);
            setButtonClassName("");
            setHideNormalButton(false);
            setHideMasterButton(false);
        }
    }, [isMaster])

    const updateFunctionary = () => {
        return Axios.patch(`https://us-central1-miproyecto-5cf83.cloudfunctions.net/app/functionaries/${props.functionaryId}`, {isMaster: isMaster});
    };

    const handleClick = (isMasterValue) => {
        setIsLoading(true);
        setButtonClassName("button-loading");

        if(!isMaster) {
            setHideMasterButton(true);
        }
        else {
            setHideNormalButton(true);
        }

        setIsMaster(isMasterValue);
    } 

    const style = css`
        z-index: 1000;
    `;

    return createPortal(
        <>
            <div className="modal-background"/>
            <div className="modal-content">
                <span className="close-btn" onClick={props.onClose}>&times;</span>
                <h1>Seleccionar privilegios del funcionario</h1>
                <div className="modal-body-horizontal">
                    <button className={buttonClassName} disabled={isLoading} hidden={hideNormalButton} onClick={() => handleClick(false)}>
                        {isLoading ? <ClipLoader css={style} color="hsl(207, 100%, 50%)" size={20} loading /> : "Privilegios normales"}
                    </button>
                    <button className={buttonClassName} disabled={isLoading} hidden={hideMasterButton} onClick={() => handleClick(true)}>
                        {isLoading ? <ClipLoader css={style} color="hsl(207, 100%, 50%)" size={20} loading /> : "Privilegios master"}
                    </button>
                </div>
            </div>
        </>,
        document.getElementById("portal")
    );
}

export default EditFunctionaryModal;