import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader, { Skeleton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useGetLineQuery } from "../../../redux/api/dashboardApi";
import { RootState } from "../../../redux/store";
import { getLastMonths } from "../../../utils/features";


const Linecharts = () => {

  const {user,loading}=useSelector((state:RootState)=>state.userReducer);

  const {data,isLoading,isError}=useGetLineQuery(user?._id as string)

  const {lastTwelveMonths}=getLastMonths();

  if(isError){
    return <Navigate to="/admin/dashboard"/>
  }

  const charts=data?.charts!;

  return loading?<Loader/>:(
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton count={25}/>:<main className="chart-container">
        <h1>Line Charts</h1>
        <section>
          <LineChart
            data={charts.users}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={lastTwelveMonths}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={charts.products}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={lastTwelveMonths}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={charts.revenue}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={lastTwelveMonths}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={charts.discount}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={lastTwelveMonths}
          />
          <h2>Discount Allotted </h2>
        </section>
      </main>}
    </div>
  );
};

export default Linecharts;
