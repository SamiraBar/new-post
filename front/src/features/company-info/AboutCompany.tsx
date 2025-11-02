import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import logo from "../../assets/logo/newPostLogo.jpeg";

const AboutCompany = () => {
    return (
        <section
            id="about"
            className="w-full px-4 pt-0 pb-10 max-w-full sm:max-w-xl md:max-w-5xl mx-auto"
        >
            <Card className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 p-4 md:p-6 w-full shadow-md rounded-2xl transition-transform transform hover:scale-105">

                <CardHeader className="flex-1 text-center md:text-left order-2 md:order-1 max-w-full md:max-w-md">
                    <CardTitle className="text-2xl md:text-3xl font-semibold mb-3">
                        Биз жонундо / О компании
                    </CardTitle>
                    <Separator className="bg-amber-600 mb-4" />
                    <CardContent className="p-0 text-gray-700 text-sm md:text-base space-y-2">
                        <p>
                            Маалымат азырынча жеткиликтүү эмес. Компания тууралуу маалымат кийинчерээк кошулат.
                        </p>
                        <p>
                            Информация о компании появится позже. Здесь будет описание, миссия и ценности.
                        </p>
                    </CardContent>
                </CardHeader>

                <div className="flex-1 flex justify-center md:justify-end order-1 md:order-2">
                    <a href="#" className="block transition-transform transform hover:scale-105">
                        <img
                            src={logo}
                            alt="New Post logo"
                            className='w-32 h-auto sm:w-40 md:w-44 lg:w-48'
                        />
                    </a>
                </div>
            </Card>
        </section>

    );
};

export default AboutCompany;
