export default function Footer() {
    return (
        <footer className="footer footer-center p-6 bg-surface text-base-content mt-12 border-t border-border1 z-20 relative">
            <div>
                <div className="flex items-center gap-2 justify-center mb-2">
                    <span className="w-6 h-6 rounded bg-gradient-to-br from-saffron to-orange-700 flex items-center justify-center text-xs shadow-md">🏛️</span>
                    <span className="font-display font-black text-sm text-text1 uppercase tracking-wider">GovCopilot <span className="text-saffron">2026</span></span>
                </div>
                <p className="text-xs text-text3 font-medium">Empowering Indian Leadership with Artificial Intelligence</p>
                <p className="text-[10px] text-text3/50 mt-1">Copyright © 2026 - All rights reserved by GovCoPilot India</p>
            </div>
        </footer>
    )
}
