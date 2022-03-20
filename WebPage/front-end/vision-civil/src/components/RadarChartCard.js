import "../styles/Dashboard.scss";
import { useSelector } from "react-redux";
import { PolarAngleAxis, PolarGrid, RadarChart, ResponsiveContainer, Radar, Legend, PolarRadiusAxis, Tooltip, Label, LabelList } from "recharts";

const RadarChartCard = () => {
    const typeChartsData = useSelector((state) => state.typeChartsData.value);

    const sampleData = {
        hurtoViviendaNum: 8,
        hurtoPersonaNum: 39,
        hurtoVehiculoNum: 20,
        vandalismoNum: 12,
        violacionNum: 27,
        homicidioNum: 12,
        agresionNum: 68,
        otroNum: 7
    }

    const biggest = Math.max(...Object.values(sampleData))

    const round5 = (x) => {
        console.log(Math.ceil(x / 5) * 5);
        return Math.ceil(x / 5) * 5;
    }

    const data = [
        {
            reportType: "Hurto de viviendas",
            A: sampleData.hurtoViviendaNum,
            fullMark: biggest
        },
        {
            reportType: "Hurto a personas",
            A: sampleData.hurtoPersonaNum,
            fullMark: biggest
        },
        {
            reportType: "Hurto de vehículos",
            A: sampleData.hurtoVehiculoNum,
            fullMark: biggest
        },
        {
            reportType: "Vandalismo",
            A: sampleData.vandalismoNum,
            fullMark: biggest
        },
        {
            reportType: "Violación",
            A: sampleData.violacionNum,
            fullMark: biggest
        },
        {
            reportType: "Homicidio",
            A: sampleData.homicidioNum,
            fullMark: biggest
        },
        {
            reportType: "Agresión",
            A: sampleData.agresionNum,
            fullMark: biggest
        },
        {
            reportType: "Otro",
            A: sampleData.otroNum,
            fullMark: biggest
        }
    ]

    return (
        <ResponsiveContainer className="card-radarchart-container" width="100%" height="100%">
            <RadarChart data={data} outerRadius={150} width={730} height={250}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="reportType" style={{fontFamily: ["Manjari", "sansSerif"], fontSize: "0.9rem"}}/>
                <PolarRadiusAxis angle={90} domain={[0, round5(biggest)]} style={{fontSize: "0.8rem"}} tick={false}/>
                <Radar name="Reportes" dataKey="A" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6}/>
                <Tooltip/>
            </RadarChart>
        </ResponsiveContainer>
    )
}

export default RadarChartCard