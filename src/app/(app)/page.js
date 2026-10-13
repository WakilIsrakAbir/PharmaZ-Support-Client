import HomeRedirect from "@/components/sidebar/HomeRedirect";

// "/" has no page of its own: everyone goes on to their home
export default function Home() {
  return <HomeRedirect />;
}
