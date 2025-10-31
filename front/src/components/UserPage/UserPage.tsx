import InfoSendPost from "@/features/InfoSendPost.tsx";

const UserPage = () => {
    return (
        <div>
            <header><h1>Добро пожаловать!</h1></header>
            <main>
                <div style={{ color: '#666' }}>
                    Расчитать/Следить за посылкой тут.
                </div>
                <div className={'m-auto'}>
                    <InfoSendPost/>
                </div>
            </main>
        </div>
    );
};

export default UserPage;