const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className="group relative flex h-5 w-5 items-center justify-center outline-none"
        data-testid={dataTestId || 'radio-button'}
      >
        <div className="border-2 border-primary-200 group-hover:border-primary-400 bg-white group-data-[state=checked]:bg-primary-500 group-data-[state=checked]:border-primary-500 group-focus:!border-primary-600 group-disabled:!bg-neutral-100 group-disabled:!border-primary-100 flex h-[14px] w-[14px] items-center justify-center rounded-full transition-all duration-200">
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className="group flex items-center justify-center"
            >
              <div className="bg-white rounded-full h-1.5 w-1.5"></div>
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
