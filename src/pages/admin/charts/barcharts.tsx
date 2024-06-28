import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader, { Skeleton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { useGetBarQuery } from "../../../redux/api/dashboardApi";
import { RootState } from "../../../redux/store";
import { getLastMonths } from "../../../utils/features";


const Barcharts = () => {

  const {user,loading}=useSelector((state:RootState)=>state.userReducer);

  const {data,isLoading,isError}=useGetBarQuery(user?._id as string)

  const {lastSixMonths,lastTwelveMonths}=getLastMonths();

  if(isError){
    return <Navigate to="/admin/dashboard"/>
  }

  const charts=data?.charts!;

  return loading?<Loader/>:(
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton count={25}/>:<main className="chart-container">
        <h1>Bar Charts</h1>
        <section>
          <BarChart
            data_1={charts.products}
            data_2={charts.users}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
            labels={lastSixMonths}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={charts.orders}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={lastTwelveMonths}
          />
          <h2>Orders throughout the year</h2>
        </section>
      </main>}
    </div>
  );
};

export default Barcharts;
