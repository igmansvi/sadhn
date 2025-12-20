import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Briefcase, Code, TrendingUp, Users, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        });
    };

    const features = [
        { icon: Code, label: "Learn Skills" },
        { icon: Briefcase, label: "Get Jobs" },
        { icon: Users, label: "Network" },
        { icon: TrendingUp, label: "Grow" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="min-h-screen flex">
            <motion.div
                className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-primary to-secondary items-center justify-center relative overflow-hidden"
                onMouseMove={handleMouseMove}
            >
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.1), transparent 80%)`,
                    }}
                />

                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))" }}
                >
                    <defs>
                        <filter id="glow-auth">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="150"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        filter="url(#glow-auth)"
                    />

                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="80"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        filter="url(#glow-auth)"
                    />

                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="220"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray="5,5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        filter="url(#glow-auth)"
                    />
                </svg>

                <motion.div
                    className="absolute top-1/4 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute bottom-1/4 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />

                <motion.div
                    className="absolute top-1/3 -left-40 w-56 h-56 border-2 border-dashed border-white/15 rounded-full pointer-events-none"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <motion.div
                    className="absolute bottom-1/3 -right-40 w-64 h-64 border border-white/10 rounded-full pointer-events-none"
                    animate={{
                        rotate: [360, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: { duration: 45, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    }}
                />

                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <motion.div
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <motion.div
                            className="absolute"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: "280px",
                                height: "280px",
                            }}
                        >
                            <motion.div
                                className="absolute w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                style={{
                                    top: "0",
                                    left: "50%",
                                    marginLeft: "-22px",
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0,
                                }}
                            >
                                <Code className="h-5 w-5" />
                            </motion.div>

                            <motion.div
                                className="absolute w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                style={{
                                    top: "50%",
                                    right: "0",
                                    marginTop: "-22px",
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.2,
                                }}
                            >
                                <TrendingUp className="h-5 w-5" />
                            </motion.div>

                            <motion.div
                                className="absolute w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                style={{
                                    bottom: "0",
                                    left: "50%",
                                    marginLeft: "-22px",
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.4,
                                }}
                            >
                                <Users className="h-5 w-5" />
                            </motion.div>

                            <motion.div
                                className="absolute w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                style={{
                                    top: "50%",
                                    left: "0",
                                    marginTop: "-22px",
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.6,
                                }}
                            >
                                <BookOpen className="h-5 w-5" />
                            </motion.div>

                            <motion.div
                                className="absolute w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                style={{
                                    top: "25%",
                                    right: "10%",
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.8,
                                }}
                            >
                                <Target className="h-5 w-5" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="relative z-10 text-center text-primary-foreground px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="relative">
                            <motion.div
                                className="w-24 h-24 mx-auto mb-6 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-xl"
                                whileHover={{ scale: 1.15, rotate: 10 }}
                                animate={{
                                    y: [0, -12, 0],
                                    boxShadow: [
                                        "0 10px 30px rgba(255, 255, 255, 0.2)",
                                        "0 15px 40px rgba(255, 255, 255, 0.3)",
                                        "0 10px 30px rgba(255, 255, 255, 0.2)",
                                    ],
                                }}
                                transition={{
                                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                }}
                            >
                                <Briefcase className="h-12 w-12" />
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h1 className="text-7xl mb-4 italic font-bold drop-shadow-lg" style={{ fontFamily: "'Satisfy', cursive" }}>
                                sadhn
                            </h1>
                        </motion.div>

                        <motion.p variants={itemVariants} className="text-lg opacity-95 leading-relaxed max-w-sm mx-auto drop-shadow">
                            Your gateway to career growth and professional development
                        </motion.p>

                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-2 gap-4 mt-12"
                        >
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.1, borderColor: "rgba(255, 255, 255, 0.6)" }}
                                        className="p-4 bg-white/15 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/20 transition-all cursor-pointer"
                                    >
                                        <motion.div
                                            className="flex flex-col items-center gap-2"
                                            animate={{
                                                y: [0, -5, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: index * 0.2,
                                            }}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-sm font-medium text-white/90">{feature.label}</span>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center gap-2 mt-8"
                        >
                            {[0, 1, 2].map((dot) => (
                                <motion.div
                                    key={dot}
                                    className="w-2 h-2 rounded-full bg-white/70"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.3, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: dot * 0.2,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Link to="/" className="flex items-center gap-2 text-2xl mb-8 lg:hidden">
                        <Briefcase className="h-6 w-6" />
                        <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                    </Link>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}