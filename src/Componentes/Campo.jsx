import React from 'react';

function Campo (props) {
        const{titulo, texto} = props;
        return(
            <div className="container5">
                <label className="campo-titulo">{titulo}</label>
                <input
                    required="true"
                    placeholder={texto}
                    className="campo-texto"
                />
            </div>
        );
}

export default Campo;