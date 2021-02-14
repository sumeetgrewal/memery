import { useState } from 'react'
import arrow from '../assets/images/arrow-light.png'

interface IdFormProps {
    numInputs: number,
    onSubmit: (value: string) => any,
}

export default function IdForm (props: IdFormProps) {
    const [ formValue, setFormValue ] = useState(new Array(props.numInputs).fill(""))

    const handleSubmit = () => {
        props.onSubmit(formValue.join(""));
    }
    
    const handleInputChange = (e: any ) => {
        const { id, value } = e?.target;
        const newId = [...formValue];

        newId[Number(id)] = value;
        setFormValue(newId);

        let element = document.getElementById(id)
        let next = element?.nextElementSibling;

        if (value.length === 1 && next) {
            (next as HTMLElement).focus()
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
                    onKeyDown={handleBack} onChange={handleInputChange}
                />
            )
        }

        return inputs;  
    }

    return (<>
        <form name="IdForm" onSubmit={handleSubmit} className="id-form">
            {renderInputs()}
            <input type="image" src={arrow} className={`arrow-btn submit-btn`} 
                alt="arrow button" id="submit-game-id" 
                onClick={handleSubmit} onKeyDown={handleBack} 
            />
        </form>
     </>)
}
