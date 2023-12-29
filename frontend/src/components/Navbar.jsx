import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";

import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import Menu from "./Menu";

const Navbar = () => {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);

  const path = useLocation().pathname;
  const { user, setUser } = useContext(UserContext);

  const showMenu = () => setMenu(!menu);

  const userDetail = JSON.parse(localStorage.getItem("info"));
  console.log(userDetail);

  const getUser = useCallback(async () => {
    try {
      const res = await axios.get(
        `${URL}/api/auth/refetch/${userDetail?.userInfo?._id}`
      );
      setUser(res?.data?.userInfo);
      localStorage.setItem("info", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
    }
  }, [setUser, userDetail?.userInfo?._id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
      <h1 className="text-lg md:text-xl font-extrabold">
        <Link to="/">Blog App</Link>
      </h1>
      {path === "/" && (
        <div className="flex justify-center items-center space-x-0">
          <p
            onClick={() =>
              navigate(prompt ? "?search=" + prompt : navigate("/"))
            }
            className="cursor-pointer"
          >
            <BsSearch />
          </p>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="outline-none px-3 "
            placeholder="Search a post"
            type="text"
          />
        </div>
      )}
      <div className="hidden md:flex items-center justify-center space-x-2 md:space-x-4">
        {user ? (
          <h3>
            <Link to="/write">Write</Link>
          </h3>
        ) : (
          <h3>
            <Link to="/login">Login</Link>
          </h3>
        )}
        {user ? (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative">
              <FaBars />
            </p>
            {menu && <Menu />}
          </div>
        ) : (
          <h3>
            <Link to="/register">Register</Link>
          </h3>
        )}
      </div>
      <div onClick={showMenu} className="md:hidden text-lg">
        <p className="cursor-pointer relative">
          <FaBars />
        </p>
        {menu && <Menu />}
      </div>
    </div>
  );
};

export default Navbar;
