// Lo use para realizar pruebas de los modales, ahorita ya no esta en uso
const Home = () => {
    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    textAlign: 'center',
                    padding: '20px',
                    transition: 'filter 0.3s ease',
                }}
            >
                <h1>Bienvenido a FinTrack</h1>
                <p>Administra tus finanzas de manera sencilla y eficiente.</p>
                <button
                    style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}
                >
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
};

export default Home;
