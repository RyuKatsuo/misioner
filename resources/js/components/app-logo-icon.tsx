import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img 
            {...props} 
            src="/favicon.svg" 
            alt="App Logo" 
            className={`block ${props.className || ''}`}
        />
    );
}
