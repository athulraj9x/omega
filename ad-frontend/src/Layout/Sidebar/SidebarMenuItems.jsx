/** @format */

import React, { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SvgIcon from "../../Components/Common/Component/SvgIcon";
import CustomizerContext from "../../_helper/Customizer";
import { MENUITEMS } from "./Menu";
import { convertToCamelCase } from "../../utils/helper";
import { useSelector } from "react-redux";
import { ManagerRoles, layerRoles } from "../../Constant";

const SidebarMenuItems = ({
  setMainMenu,
  sidebartoogle,
  setNavActive,
  activeClass,
}) => {
  const { layout } = useContext(CustomizerContext);
  const layout1 = localStorage.getItem("sidebar_layout") || layout;
  const [menuList, setMenuList] = useState(MENUITEMS);
  const whitelabelData = useSelector((state)=>state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]);

  const { role } = useSelector((state) => state.Login.userData);

  const path = window.location.pathname.split("/").pop();
  const CurrentPath = path.replace(/-/g, "_");

  const { t } = useTranslation();
  const toggletNavActive = (item) => {
    if (window.innerWidth <= 991) {
      document.querySelector(".page-header").className =
        "page-header close_icon";
      document.querySelector(".sidebar-wrapper").className =
        "sidebar-wrapper close_icon ";
      document
        .querySelector(".mega-menu-container")
        ?.classList?.remove("d-block");
      if (item.type === "sub") {
        document.querySelector(".page-header").className = "page-header";
        document.querySelector(".sidebar-wrapper").className =
          "sidebar-wrapper";
      }
    }

    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS });
  };
 

  useEffect(() => {
    if (role !== layerRoles.DIRECTOR) {
      let adminMenu;

      if (role === ManagerRoles.ACCOUNTS_MANAGER) {
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (
                sub_menu?.managerAccess &&
                (sub_menu?.managerAccess?.includes(
                  ManagerRoles.ACCOUNTS_MANAGER
                ) ||
                  sub_menu?.managerAccess?.includes("ALL"))
              ) {
                if (sub_menu?.children) {
                  const filter = sub_menu?.children.filter(
                    (child) => !child.account
                  );
                  sub_menu.children = filter;
                }
                return sub_menu;
              }
              return null;
            }),
          };
        });
      } else if (role === ManagerRoles.MANAGER) {
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (
                sub_menu?.managerAccess &&
                (sub_menu?.managerAccess?.includes(ManagerRoles.MANAGER) ||
                  sub_menu?.managerAccess?.includes("ALL"))
              ) {
                if (sub_menu?.children) {
                  const filter = sub_menu?.children.filter(
                    (child) => !child.manager && (child?.access?.includes(ManagerRoles.MANAGER) )
                  );
                  sub_menu.children = filter;
                }
                return sub_menu;
              }
              return null;
            }),
          };
        });
      } else if (role === ManagerRoles.FANCY_MANAGER) {
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (
                sub_menu?.managerAccess &&
                (sub_menu?.managerAccess?.includes(
                  ManagerRoles.FANCY_MANAGER
                ))
              ){ 
                if(sub_menu?.type==="sub" && sub_menu?.children){
                  const filteredChildren = sub_menu?.children?.filter((child) =>
                    child.access?.includes(ManagerRoles.FANCY_MANAGER)
                  );
      
                  // Only return sub_menu if there are matching children
                  if (filteredChildren.length > 0) {
                    sub_menu.children = filteredChildren;
                    return sub_menu;
                  } else{
                    return sub_menu;
                  }
                }
                else {
                 return sub_menu;
                }
               }
              return null;
            }),
          };
        });
      } else if (role === ManagerRoles.OPERATIONAL_MANAGER) {
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (
                sub_menu?.managerAccess &&
                (sub_menu?.managerAccess?.includes(
                  ManagerRoles.OPERATIONAL_MANAGER
                ) ||
                  sub_menu?.managerAccess?.includes("ALL"))
              ) {
                return sub_menu;
              }
              return null;
            }),
          };
        });
      } else if (role === ManagerRoles.MONITORING_MANAGER) {
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (
                (sub_menu?.access &&
                  sub_menu?.access?.includes &&
                  sub_menu?.access?.includes(
                    ManagerRoles.MONITORING_MANAGER
                  )) ||
                (sub_menu?.access &&
                  sub_menu?.access?.includes(ManagerRoles.MONITORING_MANAGER))
              ) {
                if (sub_menu?.children ) {
                  const filter = sub_menu?.children?.filter(
                    (child) => !child.monitor && child.access?.includes(role)
                  );
                  sub_menu.children = filter;
                }
                return sub_menu;
              }
              return null;
            }),
          };
        });
      } else if (role === layerRoles.WHITE_LABEL) {
        const bankService = whitelabelData?.whiteLabelBankServices
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (!sub_menu?.auth || sub_menu.whiteLabel) {
                if (sub_menu?.children) {
                  const filter = sub_menu?.children.filter(
                    ((child) => {
                      if((child?.path === "/crypto-withdrawal-list" && bankService === "Bank")){
                        return false
                      }
                      return !child.auth || child.whiteLabel})
                  );

                  sub_menu.children = filter;
                }
                return sub_menu;
              }
              return null;
            }),
          };
        });
      } else {
        adminMenu = menuList?.map((menu) => {
          return {
            ...menu,
            Items: menu.Items?.filter((sub_menu) => {
              if (!sub_menu?.auth) {
                if (sub_menu?.children) {
                  const filter = sub_menu?.children.filter(
                    (child) => !child.auth
                  );
                  sub_menu.children = filter;
                }
                return sub_menu;
              }

              return null;
            }),
          };
        });
      }
      setMenuList(adminMenu);
    }
  }, [role,whitelabelData?.whiteLabelBankServices]);


  return (
    <>
      {menuList.map((Item, i) => {
        return <Fragment key={i}>
          <li className="sidebar-main-title">
            <div>
              <h6 className="lan-1">{t(Item.menutitle)}</h6>
            </div>
          </li>
          {Item.Items.map((menuItem, j) => {
             if((menuItem.title==="Deposit" || menuItem.title==="Withdrawal" || menuItem.title==="Helpline" ) && whitelabelData?.whiteLabelType!=="B2C"){
              return null;
            }
            else{
              return<li className="sidebar-list" key={j}>
              {menuItem.type === "sub" ? (
                <a
                  href="javascript"
                  className={`d-flex align-items-center sidebar-link sidebar-title ${CurrentPath === menuItem.title.toLowerCase() ? "active" : ""
                    } ${menuItem.active ? "active" : ""}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setNavActive(menuItem);
                    activeClass(menuItem.active);
                  }}
                >
                  <SvgIcon
                    className="stroke-icon text-dark"
                    iconId={`stroke-${menuItem.icon}`}
                  />
                  <SvgIcon
                    className="fill-icon text-dark"
                    iconId={`fill-${menuItem.icon}`}
                  />
                  <span>{t(menuItem.title)}</span>
                  {menuItem.badge ? (
                    <label className={menuItem.badge}>
                      {menuItem.badgetxt}
                    </label>
                  ) : (
                    ""
                  )}
                  <div className="according-menu">
                    {menuItem.active ? (
                      <i className="fa fa-angle-down"></i>
                    ) : (
                      <i className="fa fa-angle-right"></i>
                    )}
                  </div>
                </a>
              ) : (
                ""
              )}

              {/* colapse */}
              {menuItem.type === "link" ? (
                <Link
                  to={menuItem.path}
                  className={`d-flex align-items-center sidebar-link sidebar-title link-nav  ${CurrentPath === menuItem.title.toLowerCase() ? "active" : ""
                    }`}
                  onClick={() => {
                    toggletNavActive(menuItem);
                  }}
                >
                  <SvgIcon
                    className="stroke-icon text-dark"
                    iconId={`stroke-${menuItem.icon}`}
                  />
                  <SvgIcon
                    className="fill-icon text-dark"
                    iconId={`fill-${menuItem.icon}`}
                  />
                  <span>{t(menuItem.title)}</span>
                  {menuItem.badge ? (
                    <label className={menuItem.badge}>
                      {menuItem.badgetxt}
                    </label>
                  ) : (
                    ""
                  )}
                </Link>
              ) : (
                ""
              )}

              {menuItem.children ? (
                <ul
                  className="sidebar-submenu"
                  style={
                    layout1 !== "compact-sidebar compact-small"
                      ? menuItem?.active ||
                        CurrentPath === menuItem?.title?.toLowerCase()
                        ? sidebartoogle
                          ? { opacity: 1, transition: "opacity 500ms ease-in" }
                          : { display: "block" }
                        : { display: "none" }
                      : { display: "none" }
                  }
                >
                  {menuItem.children.map((childrenItem, index) => {
                    return (
                      <li key={index}>
                        {childrenItem.type === "sub" ? (
                          <a
                            href="javascript"
                            className={`${CurrentPath === childrenItem?.title?.toLowerCase()
                                ? "active"
                                : ""
                              }`}
                            onClick={(event) => {
                              event.preventDefault();
                              toggletNavActive(childrenItem);
                            }}
                          >
                            {t(childrenItem.title)}
                            <span className="sub-arrow">
                              <i className="fa fa-chevron-right"></i>
                            </span>
                            <div className="according-menu">
                              {childrenItem.active ? (
                                <i className="fa fa-angle-down"></i>
                              ) : (
                                <i className="fa fa-angle-right"></i>
                              )}
                            </div>
                          </a>
                        ) : (
                          ""
                        )}

                        {childrenItem.type === "link" ? (
                          <Link
                            to={childrenItem.path}
                            className={`${CurrentPath === childrenItem?.title?.toLowerCase()
                                ? "active"
                                : ""
                              }`}
                            // className={`${childrenItem.active ? 'active' : ''}`} bonusui
                            onClick={(e) => {
                              e.stopPropagation();
                              toggletNavActive(childrenItem);
                            }}
                          >
                            {t(childrenItem.title)}
                          </Link>
                        ) : (
                          ""
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                ""
              )}
            </li>
            }
            })}
        </Fragment>
      })}
    </>
  );
};

export default SidebarMenuItems;
