// src/pages/MainPage.tsx
import React from 'react'
import { motion } from 'framer-motion'
import './MainPage.css'

export const MainPage: React.FC = () => {
    return (
        <div className="luna-landing-root">
            <div className="luna-landing-bg-stars" />
            <div className="luna-landing-bg-vignette" />

            <header className="landing-topbar glass">
                <div className="landing-logo">L.U.N.A.</div>
                <div className="landing-top-center">
                    <span className="landing-pill">MAIN PAGE</span>
                </div>
                <div className="landing-top-right">
                    <span className="landing-status-dot" />
                    <span className="landing-status-text">ONLINE</span>
                </div>
            </header>

            <main className="landing-main">
                <section className="landing-hero glass">
                    <div className="landing-radial-wrapper">
                        <RadialSigil />
                    </div>
                    <div className="landing-title-block">
                        <h1 className="landing-title">L.U.N.A.</h1>
                        <p className="landing-subtitle">
                            A MYSTICAL INTERFACE FOR SILENT CONVERSATIONS
                        </p>
                    </div>
                </section>
            </main>

            <footer className="landing-footer glass">
                <span className="footer-item">
                    UNITY LINK : <b>CONNECTED</b>
                </span>
                <span className="footer-separator">·</span>
                <span className="footer-item">
                    CHANNEL : <b>STARGLOW</b>
                </span>
                <span className="footer-separator">·</span>
                <span className="footer-item">
                    BUILD : <b>DEV-2025.11</b>
                </span>
            </footer>
        </div>
    )
}

interface Particle {
    x: number;
    y: number;
    r: number;
    opacity: number;
    depth: number;
    hue: number;
    id: number;
    phi: number;
    theta: number;
}

interface ParticleConnection {
    a: number;
    b: number;
    distance: number;
    strength: number;
}

const RadialSigil: React.FC = () => {
    const center = { x: 130, y: 130 }
    const sphereRadius = 75  // 스피어 크기 증가

    // 파티클 생성: 훨씬 높은 밀도
    const particles: Particle[] = [];
    const particleCount = 800;  // 파티클 개수 대폭 증가

    for (let i = 0; i < particleCount; i++) {
        // 구면 좌표로 균등 분포
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = center.x + sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = center.y + sphereRadius * Math.sin(phi) * Math.sin(theta);
        const depth = (Math.cos(phi) + 1) / 2;
        
        // 파티클 크기: 더 크게 조정
        const baseRadius = 0.6 + Math.random() * 0.6;
        const r = baseRadius * (0.7 + depth * 0.3);
        
        // 색상: 청색~자주색~핑크 스펙트럼
        const hue = 220 + Math.random() * 80;
        
        particles.push({
            x,
            y,
            r,
            opacity: 0.5 + Math.random() * 0.5,
            depth,
            hue,
            id: i,
            phi,
            theta
        });
    }

    // 파티클 네트워크 연결 생성: 근처 파티클들끼리 연결
    const connections: ParticleConnection[] = [];
    const maxDistance = 25;  // 연결 최대 거리
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                // 거리에 따른 연결 강도
                const strength = 1 - (distance / maxDistance);
                connections.push({
                    a: i,
                    b: j,
                    distance,
                    strength: strength * strength  // 거리에 따라 더 급격히 감소
                });
            }
        }
    }

    return (
        <motion.svg
            className="landing-radial-svg"
            viewBox="0 0 260 260"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* 파티클 글로우 그라데이션 */}
                <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(220, 230, 255, 1)" />
                    <stop offset="50%" stopColor="rgba(159, 223, 251, 0.6)" />
                    <stop offset="100%" stopColor="rgba(74, 130, 255, 0)" />
                </radialGradient>

                {/* 파티클 글로우 필터 */}
                <filter id="particleGlow">
                    <feGaussianBlur stdDeviation="0.6" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* 연결선 그라데이션 */}
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(159, 223, 251, 0.4)" />
                    <stop offset="100%" stopColor="rgba(180, 200, 255, 0.2)" />
                </linearGradient>
            </defs>

            {/* 배경 글로우 */}
            <circle
                cx="130"
                cy="130"
                r="140"
                className="sphere-background-glow"
                fill="rgba(74, 130, 255, 0.08)"
            />

            {/* 연결선 렌더링 - 약한 그라데이션 */}
            {connections.map((conn, idx) => {
                const p1 = particles[conn.a];
                const p2 = particles[conn.b];
                const opacity = conn.strength * 0.3;
                
                return (
                    <line
                        key={`conn-${idx}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        className="particle-connection"
                        style={{
                            stroke: `hsla(${(p1.hue + p2.hue) / 2}, 85%, 65%, ${opacity})`,
                            strokeWidth: 0.15 + conn.strength * 0.2,
                            opacity: opacity
                        }}
                    />
                );
            })}

            {/* 파티클 렌더링 - Motion 애니메이션 */}
            {particles.map((particle, idx) => {
                // 파티클마다 고유한 애니메이션 duration 설정
                const duration = 4 + (particle.depth * 3);
                const delay = (idx % 50) * 0.05;
                
                // 부유 모션 계산
                const offsetX = (Math.sin(idx * 0.5) * 1.5);
                const offsetY = (Math.cos(idx * 0.3) * 1.5);

                return (
                    <motion.g 
                        key={`particle-${idx}`}
                        initial={{ 
                            x: 0, 
                            y: 0,
                            opacity: particle.opacity * 0.3
                        }}
                        animate={{ 
                            x: [0, offsetX, -offsetX, 0],
                            y: [0, offsetY, -offsetY, 0],
                            opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3]
                        }}
                        transition={{
                            duration: duration,
                            delay: delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {/* 파티클 글로우 오라 - 활성도 높은 파티클만 */}
                        {particle.depth > 0.5 && (
                            <circle
                                cx={particle.x}
                                cy={particle.y}
                                r={particle.r * 2}
                                className="particle-glow-ring"
                                style={{
                                    fill: `hsl(${particle.hue}, 100%, 65%)`,
                                    opacity: particle.opacity * 0.25
                                }}
                            />
                        )}

                        {/* 메인 파티클 */}
                        <circle
                            cx={particle.x}
                            cy={particle.y}
                            r={particle.r}
                            className="particle-core"
                            style={{
                                fill: `hsl(${particle.hue}, 90%, ${60 + particle.depth * 20}%)`,
                                opacity: particle.opacity * (0.7 + particle.depth * 0.3),
                                filter: particle.depth > 0.6 ? 'url(#particleGlow)' : 'none'
                            }}
                        />

                        {/* 파티클 중심 하이라이트 */}
                        {particle.depth > 0.5 && (
                            <circle
                                cx={particle.x}
                                cy={particle.y}
                                r={particle.r * 0.35}
                                style={{
                                    fill: 'rgba(255, 255, 255, 0.6)',
                                    opacity: particle.opacity * 0.4
                                }}
                            />
                        )}
                    </motion.g>
                );
            })}


        </motion.svg>
    )
}