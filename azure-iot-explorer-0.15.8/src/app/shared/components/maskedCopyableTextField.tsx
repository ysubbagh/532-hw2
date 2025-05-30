/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, getId, TooltipHost, Announced } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { LabelWithTooltip } from './labelWithTooltip';
import { LabelWithRichCallout } from './labelWithRichCallout';
import { CopyButton } from './copyButton';
import '../../css/_maskedCopyableTextField.scss';

export interface MaskedCopyableTextFieldProps {
    ariaLabel: string;
    calloutContent?: JSX.Element;
    label: string;
    labelCallout?: string;
    error?: string;
    value: string;
    allowMask: boolean;
    readOnly: boolean;
    required?: boolean;
    onTextChange?(text: string): void;
    placeholder?: string;
    setFocus?: boolean;
}

// tslint:disable-next-line: cyclomatic-complexity
export const MaskedCopyableTextField: React.FC<MaskedCopyableTextFieldProps> = (props: MaskedCopyableTextFieldProps) => {
    const hiddenInputRef = React.createRef<HTMLInputElement>();
    const visibleInputRef = React.createRef<HTMLInputElement>();
    const labelIdentifier = getId('maskedCopyableTextField');
    const toggleMaskButtonTooltipHostId = getId('toggleMaskButtonTooltipHost');

    const { t } = useTranslation();

    const { setFocus, ariaLabel, error, value, allowMask, readOnly, placeholder, calloutContent, labelCallout, required, label, onTextChange } = props;
    const [hideContents, setHideContents] = React.useState(allowMask);

    React.useEffect(
        () => {
            if (setFocus) {
                const node = visibleInputRef.current;
                if (node) {
                    node.focus();
                }
            }
        },
        [setFocus]);

    const renderLabelSection = () => {
        if (calloutContent) {
            return (<LabelWithRichCallout calloutContent={calloutContent} htmlFor={labelIdentifier} required={required}>{label}</LabelWithRichCallout>);
        }

        return (<LabelWithTooltip tooltipText={labelCallout} htmlFor={labelIdentifier} required={required}>{label}</LabelWithTooltip>);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setHideContents(false);

        if (onTextChange) {
            onTextChange(text);
        }
    };

    const toggleDisplay = () => setHideContents(!hideContents);

    return (
        <div className="maskedCopyableTextField">
            <div className="labelSection">
                {renderLabelSection()}
            </div>

            <div className="controlSection">
                <div className={`borderedSection ${error ? 'error' : ''} ${readOnly ? 'readOnly' : ''}`}>
                    <input
                        aria-label={ariaLabel}
                        id={labelIdentifier}
                        ref={visibleInputRef}
                        value={value || ''}
                        type={(allowMask && hideContents) ? 'password' : 'text'}
                        className="input"
                        readOnly={readOnly}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={props.required}
                    />
                    <input
                        aria-hidden={true}
                        style={{ position: 'absolute', opacity: 0, height: '1px', width: '1px' }}
                        tabIndex={-1}
                        ref={hiddenInputRef}
                        value={value || ''}
                        className="input"
                        readOnly={true}
                    />

                    {allowMask &&
                        <TooltipHost
                            content={hideContents ?
                                t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label.show) :
                                t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label.hide)}
                            id={toggleMaskButtonTooltipHostId}
                        >
                            <IconButton
                                iconProps={hideContents ? { iconName: 'RedEye' } : { iconName: 'Hide' }}
                                aria-labelledby={toggleMaskButtonTooltipHostId}
                                onClick={toggleDisplay}
                            />
                        </TooltipHost>
                    }
                </div>

                <div className="copySection">
                    <CopyButton copyText={value} />
                </div>
            </div>

            {error &&
                <>
                    <div className="errorSection" aria-live={'assertive'}>{error}</div>
                    <Announced message={error} />
                </>
            }
        </div>
    );
};
