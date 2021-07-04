import { ClipboardEvent, useState } from 'react'
import arrow from '../assets/images/arrow-light.png'

interface IdFormProps {
    numInputs: number,
    submitHandler: (value: string) => any,
}

export default function IdForm (props: IdFormProps) {
    const [ formValue, setFormValue ] = useState(new Array(props.numInputs).fill(""))

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (formValue.join("").length === props.numInputs) {
            props.submitHandler(formValue.join(""));
        }
    }
    
    const handleInputChange = (e: any ) => {
        const { id, value } = e?.target;
        const newId = [...formValue];

        if (value !== " ") {
            newId[Number(id)] = value;
            setFormValue(newId);
            if (value.length === 1) advanceCursor(id, [value]);
        }
    }

    const handleBack = (e: any) => {
        let element = document.getElementById(e.target.id)
        let prev = element?.previousElementSibling;

        const isImage: boolean = e.target.type === "image";
        const isEmpty: boolean = e.target.value.length === 0;

        if (e.keyCode === 8 && prev && ( isImage || isEmpty )) {
            (prev as HTMLElement).focus()
        }
    }

    const renderInputs = () => {
        const {numInputs} = props;
        const inputs: JSX.Element[] = [];
        
        if (numInputs <= 0) return;
        
        for (let i = 0; i < numInputs; i++) {
            inputs.push(
                <input className="id-form-input" key={`${i}`} type="text" 
                    maxLength={1} value={formValue[i]} 
                    id={`${i}`} autoFocus={i===0}
                    autoComplete={"off"}
                    onKeyDown={handleBack} onChange={handleInputChange}
                    onPaste={(e: ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                />
            )
        }
        return inputs;  
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        let pastedValues = event.clipboardData.getData('text').split('');

        const { id } = event.currentTarget;
        let newId = [...formValue].splice(Number(id), pastedValues.length, ...pastedValues);
        newId = newId.slice(0, props.numInputs);
        setFormValue(newId);
        advanceCursor(id, pastedValues.slice(0, props.numInputs));
    }
    
    const advanceCursor = (startId: any, value: any) => {
        let element = document.getElementById(startId)
        let next = element?.nextElementSibling;
        if (value.length >= 1 && next) (next as HTMLElement).focus()
        if (value.shift() !== undefined) advanceCursor(next?.id, value);
    }

    return (<form name="IdForm" className="id-form"> 
        {renderInputs()}
        <input type="image" src={arrow} className={`arrow-btn submit-btn`} 
            alt="arrow button" id="submit-game-id" 
            onClick={handleSubmit} onKeyDown={handleBack} 
        />
    </form>)
}
