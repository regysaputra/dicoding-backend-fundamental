import Service from "../producers/service.js";
import response from "../../../utils/response.js";

export const exportNotes = async (req, res)=>{
  const { targetEmail } = req.validated;

  const message= {
    userId: req.user.id,
    targetEmail,
  };

  await Service.sendMessage('export:notes', JSON.stringify(message));
  return response(res, 201, 'Permintaan export catatan dalam antrean');
};

