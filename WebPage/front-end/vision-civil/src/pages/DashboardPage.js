import DashboardMap from "../components/DashboardMap";
import Navbar from "../components/Navbar";
import BarChartCard from "../components/BarChartCard";
import PieChartCard from "../components/PieChartCard";
import RadarChartCard from "../components/RadarChartCard";
import LineChartCard from "../components/LineChartCard";
import AreaChartCard from "../components/AreaChartCard";
import TypeChartsFilterCard from "../components/TypeChartsFilterCard";
import TimeChartsFilterCard from "../components/TimeChartsFilterCard";
import MapFilterCard from "../components/MapFilterCard";
import MapLegend from "../components/MapLegend";

const DashboardPage = () => {
    return(
        <>
            <Navbar/>
            <div className="content-container">
                <div className="dashboard-container">
                    <MapFilterCard/>
                    <div className="card-map-container">
                        <DashboardMap/>
                    </div>
                    <MapLegend/>
                    <TypeChartsFilterCard/>
                    <PieChartCard/>
                    <RadarChartCard/>
                    <BarChartCard/>
                    <TimeChartsFilterCard/>
                    <LineChartCard/>
                    <AreaChartCard/>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;