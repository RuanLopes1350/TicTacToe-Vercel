'use client';

import { useState } from 'react';
import Image from 'next/image';

type Player = 'Azul' | 'Vermelho';
type CellValue = Player | '';

export default function Home() {
  const [tabuleiro, setTabuleiro] = useState<CellValue[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [jogadorAtual, setJogadorAtual] = useState<Player>('Azul');
  const [venceu, setVenceu] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string>('');
  const [mostrarOverlay, setMostrarOverlay] = useState<boolean>(false);

  const verificarVitoria = (tabuleiro: CellValue[][], jogador: Player): boolean => {
    // Verificar linhas
    for (let i = 0; i < 3; i++) {
      if (tabuleiro[i][0] === jogador && tabuleiro[i][1] === jogador && tabuleiro[i][2] === jogador) {
        return true;
      }
    }
    
    // Verificar colunas
    for (let i = 0; i < 3; i++) {
      if (tabuleiro[0][i] === jogador && tabuleiro[1][i] === jogador && tabuleiro[2][i] === jogador) {
        return true;
      }
    }
    
    // Verificar diagonais
    if (tabuleiro[0][0] === jogador && tabuleiro[1][1] === jogador && tabuleiro[2][2] === jogador) {
      return true;
    }
    if (tabuleiro[0][2] === jogador && tabuleiro[1][1] === jogador && tabuleiro[2][0] === jogador) {
      return true;
    }
    
    return false;
  };

  const verificarEmpate = (tabuleiro: CellValue[][]): boolean => {
    return tabuleiro.flat().every(cell => cell !== '');
  };

  const handleCellClick = (linha: number, coluna: number) => {
    if (venceu || tabuleiro[linha][coluna] !== '') {
      if (tabuleiro[linha][coluna] !== '') {
        setMensagem('Selecione uma célula vazia!');
        setMostrarOverlay(true);
      }
      return;
    }

    const novoTabuleiro = [...tabuleiro];
    novoTabuleiro[linha][coluna] = jogadorAtual;
    setTabuleiro(novoTabuleiro);

    if (verificarVitoria(novoTabuleiro, jogadorAtual)) {
      setVenceu(true);
      setMensagem(`Fim de jogo! Jogador(a) ${jogadorAtual} venceu!`);
      setMostrarOverlay(true);
    } else if (verificarEmpate(novoTabuleiro)) {
      setVenceu(true);
      setMensagem('Empate! Ninguém venceu!');
      setMostrarOverlay(true);
    } else {
      setJogadorAtual(jogadorAtual === 'Azul' ? 'Vermelho' : 'Azul');
    }
  };

  const resetarJogo = () => {
    setTabuleiro([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setJogadorAtual('Azul');
    setVenceu(false);
    setMensagem('');
    setMostrarOverlay(false);
  };

  const fecharOverlay = () => {
    setMostrarOverlay(false);
  };

  const getCellClass = (cellValue: CellValue) => {
    let baseClass = "w-32 h-32 border-2 border-gray-400 text-4xl font-bold transition-all duration-200 ";
    
    if (cellValue === 'Azul') {
      baseClass += "bg-blue-300 border-blue-800 text-blue-800";
    } else if (cellValue === 'Vermelho') {
      baseClass += "bg-red-300 border-red-800 text-red-800";
    } else {
      baseClass += "bg-blue-100 hover:bg-blue-200";
    }
    
    if (venceu) {
      baseClass += " cursor-not-allowed";
    } else if (cellValue === '') {
      baseClass += " cursor-pointer";
    }
    
    return baseClass;
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'url("/background.gif") no-repeat center center fixed',
        backgroundSize: 'cover'
      }}
    >
      <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔱Tic Tac Toe🦈</h1>
          <p className="text-lg text-black">
            Jogador(a) atual: <span className={jogadorAtual === 'Azul' ? 'text-blue-600 font-bold' : 'text-red-600 font-bold'}>{jogadorAtual}</span>
          </p>
        </header>

        <div className="grid grid-cols-3 gap-2 mb-8">
          {tabuleiro.map((linha, linhaIndex) =>
            linha.map((cell, colunaIndex) => (
              <button
                key={`${linhaIndex}-${colunaIndex}`}
                className={getCellClass(cell)}
                onClick={() => handleCellClick(linhaIndex, colunaIndex)}
                disabled={venceu || cell !== ''}
              >
                {cell === 'Azul' ? '●' : cell === 'Vermelho' ? '●' : ''}
              </button>
            ))
          )}
        </div>

        <div className="text-center">
          <button
            onClick={resetarJogo}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Image
              src="/reset-icon.png"
              alt="Reset"
              width={24}
              height={24}
            />
          </button>
        </div>

        {mostrarOverlay && (
          <div className="fixed inset-0 bg-rgba(0, 0, 0, 0.5) flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 p-6 rounded-lg text-center max-w-sm mx-4 shadow-2xl border-2 border-gray-200">
              <p 
                className="text-lg mb-4" 
                dangerouslySetInnerHTML={{ 
                  __html: mensagem.replace(
                    'Azul', 
                    '<span class="text-blue-600 font-bold">Azul</span>'
                  ).replace(
                    'Vermelho', 
                    '<span class="text-red-600 font-bold">Vermelho</span>'
                  ) 
                }}
              />
              <button
                onClick={fecharOverlay}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
