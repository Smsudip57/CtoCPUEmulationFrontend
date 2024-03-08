import React from 'react'
import { useState, useEffect, useRef } from 'react';
import question from '../question.png';
import logo from '../teamlogo.png';
import api from '../api/api'


export default function Home() {
    const[input, setinput] = useState()
    const[code, setcode] = useState()
    const [result, setresult] = useState({});
    
    const [displayedText, setDisplayedText] = useState('');
    const [assemblyText, setassemblyText] = useState('');
    const [binaryText, setbinaryText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndex1, setCurrentIndex1] = useState(0);
    const [currentIndex2, setCurrentIndex2] = useState(0);
    const[error, seterror] = useState()
    const[loadingspace, setloadingspace] = useState('    ')
    const ref = useRef(null)
    const ref1 = useRef(null)
    const ref2 = useRef(null)
    const ref3 = useRef(null)



    const linktoserver = ()=>{
        const fetchdata= async()=>{
            setcode(input)
           try {
            const data = { code:input}
            const response = await api.post("/", data)
            const mergedObject = {};

            response.data.data.forEach(({step,output})=> {
                mergedObject[step] = output
            });

              setresult(mergedObject)
           } catch (error) {
            if(error.response){
                seterror("Maybe there is a syntax issue in your code.")
            }else{
                seterror("Something went wrong. Please try again.")
            }
           }
        }
        fetchdata()
    }

    useEffect(()=>{
        
        const interval = setInterval(() => {
            if(code ){
            setloadingspace((prev)=>{
                const lengthOfDot = (prev.match(/\./g) || []).length;
                if (lengthOfDot >= 4) {
                    return ' '.repeat(4);
                } else if (lengthOfDot < 4) {
                    const remainingSpaces = 4 - (lengthOfDot + 1);
                    return (prev.trim() + '.' + ' '.repeat(remainingSpaces));
                }
            })}
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    },[code,result])





    useEffect(() => {
        const interval = setInterval(() => {
            if(code&& result.assembly&& displayedText!==result.assembly){
                setDisplayedText(prevText => prevText + result.assembly[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
                if (currentIndex === result.assembly.length - 1) {
                    clearInterval(interval);
                }
                if(ref1.current!==null){
                    ref1.current.scrollTop = ref1.current.scrollHeight
                }
                if(ref1.current!==null){
                    window.scrollTo(0, ref1.current.scrollHeight)  }
            } else if(code&& displayedText===result.assembly&&result.binary&& assemblyText!==result.binary){
                setassemblyText(prevText => prevText + result.binary[currentIndex1]);
                setCurrentIndex1(prevIndex => prevIndex + 1);
                if (currentIndex1 === result.binary.length - 1) {
                    clearInterval(interval);
                }
                if(ref2.current!==null){
                    ref2.current.scrollTop = ref2.current.scrollHeight
                }
                if(ref2.current!==null){
                    window.scrollTo(0, ref2.current.scrollHeight+ref3.current.scrollHeight)  }
            }else if(code&&  displayedText===result.assembly&&assemblyText===result.binary&& result.binary&& binaryText!==result.instructions){
                setbinaryText(prevText => prevText + result.instructions[currentIndex2]);
                setCurrentIndex2(prevIndex => prevIndex + 1);
                if (currentIndex2 === result.instructions.length - 1) {
                    clearInterval(interval);
                }
                if(ref3.current!==null){
                  window.scrollTo(0, ref2.current.scrollHeight+ref3.current.scrollHeight+ref3.current.scrollHeight)  }
                
                if(ref3.current!==null){
                    ref3.current.scrollTop = ref3.current.scrollHeight
                }
            }
        }, sudip() );

        function sudip(){
            if(code&& result.assembly&& displayedText!==result.assembly){
                return 30
            } else if(code&& displayedText===result.assembly&&result.binary&& assemblyText!==result.binary){return 20}else if(code&&  displayedText===result.assembly&&assemblyText===result.binary&& result.binary&& binaryText!==result.instructions){return 0.001}
        }

        return () => clearInterval(interval);
    }, [result, currentIndex, displayedText, assemblyText,binaryText,currentIndex1, currentIndex2,code]);


    useEffect(()=>{
        if(ref1.current!==null){
            ref1.current.scrollTop = ref1.current.scrollHeight
        }
    },[])

    // useEffect(()=>{},)



  return (
    <body className='body' >
        <header className="App-header">
        <navbar className='navbar'>
        <div className='logodiv'>
            <img style={{height:'100%'}} src={logo} alt='temalogo'></img>
          </div>
          <ul className='navbarul'>
            <li> LEARN MORE</li>
            <li>ABOUT</li>
            <li>CONTACT</li>
          </ul>
        </navbar>
      </header>{console.log(process.env.REACT_APP_PORT)}
      {!code && !error  && <div>
        <div className='hero-title'>
        <p className='title'>C to CPU Emulation</p>
      </div>
      <div className='initial-textdiv'>
        <textarea className='initial-textarea' placeholder='Your C Code Here' onChange={(e)=>setinput(e.target.value.trim())}>
        </textarea>
      </div>
      <div className='hero-title'>
        <button className='initial-buttom' onClick={()=>linktoserver()}>Emulate</button>
      </div>
      </div>}
      {
        code && !error&& <div style={{paddingBottom:'200px'}} ref={ref}>
            
            <p className='result-title'>C to CPU Emulator</p>
            <div className='title-div'>
                <p>Linking</p>
                <img src={question} alt='questionlogo'></img>
            </div>
            <div className='result-text' value={displayedText} ref={ref1} placeholder={`Linking your program.${loadingspace}`}><p className={displayedText || 'result-text-placeholder'} style={{whiteSpace:'pre-line'}}>{displayedText||`Linking your program.${loadingspace}`}</p></div>
            <div className='title-div'>
                <p>Compilation to Assembly</p>
                <img src={question} alt='questionlogo'></img>
            </div>
            <div className='result-text' ref={ref2} style={{position:'relative'}} placeholder={`Waiting for Linking.${loadingspace}`}><p className={assemblyText || 'result-text-placeholder'} style={{whiteSpace:'pre-line'}}>{assemblyText||`Linking your program.${loadingspace}`}</p></div>
            <div className='title-div'>
                <p>Convert to Binary</p>
                <img src={question} alt='questionlogo'></img>
            </div>
            <div className='result-text' value={binaryText} ref={ref3}  placeholder={`Waiting for Linking.${loadingspace}`} ><p className={binaryText ||'result-text-placeholder'} style={{whiteSpace:'pre-line'}}>{binaryText||`Linking your program.${loadingspace}`}</p></div>
            <button className='initial-buttom' onClick={()=>{setcode();setinput();setCurrentIndex(0);setCurrentIndex1(0);setCurrentIndex2(0);setDisplayedText('');setassemblyText('');setbinaryText('')}}>Emulate Again?</button>
        </div>
      }
      {
        error && <><h1>Status 500 - failed to emulate the code.</h1>
        <button className='initial-buttom' onClick={()=>{setcode();setinput();setCurrentIndex(0);setCurrentIndex1(0);setCurrentIndex2(0);setDisplayedText('');setassemblyText('');setbinaryText('');seterror()}}>Emulate Again?</button></>
      }
      </body>
  )
}
