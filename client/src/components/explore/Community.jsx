import React, { useState } from "react";
import { Card } from "../ui/card";

const Community = () => {
  const [activeUser, setActiveUser] = useState(null);

  const users = [
    { id: 1, name: "Raj Kumar", role: "Developer", img: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg" },
    { id: 2, name: "Priya Singh", role: "Designer", img: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" },
    { id: 3, name: "Amit Shah", role: "Analyst", img: "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png" }
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-100 via-white to-cyan-100 rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col p-4 border border-orange-200/50">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">
          Community
        </h2>
        <span className="bg-gradient-to-r from-orange-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          2.5k Members
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-3">
          {users.map((user, idx) => (
            <div
              key={user.id}
              className="relative group"
              onMouseEnter={() => setActiveUser(user.id)}
              onMouseLeave={() => setActiveUser(null)}
            >
              <img
                src={user.img}
                alt={user.name}
                className={`w-16 h-16 rounded-full border-4 border-white shadow-lg transition-all duration-300 cursor-pointer
                  ${activeUser === user.id ? 'scale-125 -translate-y-2' : 'hover:scale-110'}
                  ${idx === 1 ? 'w-20 h-20' : ''}`}
              />
              {activeUser === user.id && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                  {user.name}
                  <div className="text-gray-300 text-[10px]">{user.role}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md mt-3 flex-shrink-0">
        Join Community
      </button>
    </Card>
  );
};

export default Community;
