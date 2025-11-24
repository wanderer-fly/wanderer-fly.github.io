// mixins.highlight = {
//     data() {
//         return { copying: false };
//     },
//     created() {
//         hljs.configure({ ignoreUnescapedHTML: true });
//         this.renderers.push(this.highlight);
//     },
//     methods: {
//         sleep(ms) {
//             return new Promise((resolve) => setTimeout(resolve, ms));
//         },
//         highlight() {
//             let codes = document.querySelectorAll("pre");
//             for (let i of codes) {
//                 let code = i.textContent;
//                 let language = [...i.classList, ...i.firstChild.classList][0] || "plaintext";
//                 let highlighted;
//                 try {
//                     highlighted = hljs.highlight(code, { language }).value;
//                 } catch {
//                     console.log('[-] Highlight.js: Unknown language "' + language + '", use plaintext instead.');
//                     highlighted = code;
//                 }
//                 i.innerHTML = `
//                 <div class="code-content hljs">${highlighted}</div>
//                 <div class="language">${language}</div>
//                 <div class="copycode">
//                     <i class="fa-solid fa-copy fa-fw"></i>
//                     <i class="fa-solid fa-check fa-fw"></i>
//                 </div>
//                 `;
//                 let content = i.querySelector(".code-content");
//                 hljs.lineNumbersBlock(content, { singleLine: true });
//                 let copycode = i.querySelector(".copycode");
//                 copycode.addEventListener("click", async () => {
//                     if (this.copying) return;
//                     this.copying = true;
//                     copycode.classList.add("copied");
//                     await navigator.clipboard.writeText(code);
//                     await this.sleep(1000);
//                     copycode.classList.remove("copied");
//                     this.copying = false;
//                 });
//             }
//         },
//     },
// };

mixins.highlight = {
    data() {
        return { 
            copying: false,
            // 预加载常用语言模块
            languages: {
                'python': () => import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js'),
                'javascript': () => import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js'),
                'java': () => import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/java.min.js'),
                'cpp': () => import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cpp.min.js'),
                'css': () => import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/css.min.js'),
                'xml': () => import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xml.min.js')
            }
        };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        
        // 动态加载语言模块
        async loadLanguage(language) {
            if (hljs.getLanguage(language)) {
                return true; // 语言已加载
            }
            
            if (this.languages[language]) {
                try {
                    const module = await this.languages[language]();
                    hljs.registerLanguage(language, module.default);
                    return true;
                } catch (error) {
                    console.warn(`无法加载语言模块: ${language}`, error);
                    return false;
                }
            }
            
            return false;
        },
        
        async highlight() {
            let codes = document.querySelectorAll("pre");
            for (let i of codes) {
                let code = i.textContent;
                let language = [...i.classList, ...i.firstChild?.classList || []].find(cls => 
                    cls.startsWith('language-')
                )?.replace('language-', '') || "plaintext";
                
                // 确保语言模块已加载
                const languageLoaded = await this.loadLanguage(language);
                if (!languageLoaded) {
                    console.log('[-] Highlight.js: Unknown language "' + language + '", use plaintext instead.');
                    language = "plaintext";
                }
                
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch (error) {
                    console.log('[-] Highlight.js: Error highlighting language "' + language + '", use plaintext instead.', error);
                    highlighted = hljs.highlight(code, { language: "plaintext" }).value;
                }
                
                i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
                <div class="language">${language}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;
                
                let content = i.querySelector(".code-content");
                if (hljs.lineNumbersBlock) {
                    hljs.lineNumbersBlock(content, { singleLine: true });
                }
                
                let copycode = i.querySelector(".copycode");
                copycode.addEventListener("click", async () => {
                    if (this.copying) return;
                    this.copying = true;
                    copycode.classList.add("copied");
                    await navigator.clipboard.writeText(code);
                    await this.sleep(1000);
                    copycode.classList.remove("copied");
                    this.copying = false;
                });
            }
        },
    },
};